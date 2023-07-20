import json
import time
from flask import Flask, Response, request, jsonify
import config
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
from apscheduler.schedulers.background import BackgroundScheduler

import stripe
import utilities

cred = credentials.Certificate('service-account-key.json')
endpoint_secret = config.STRIPE_WEBHOOK_ENDPOINT_SECRET
app = firebase_admin.initialize_app(cred)
db = firestore.client()
stripe.api_key = config.STRIPE_API_SECRET_KEY

app = Flask(
    __name__,
    static_url_path='',
    static_folder='public'
)

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res = utilities.handle_cors(request.origin, res)
        res.headers.add('Access-Control-Allow-Headers', 'Content-Type')

        return res
    
@app.route('/hugging-face-api', methods=['POST'])
def hugging_face_api():
    print(request.origin)
    data = json.loads(request.data)
    API_URL = "https://api-inference.huggingface.co/models/jjcavallo5/generative_aac"
    headers = {"Authorization": f"Bearer {config.HF_API_KEY}"}

    response = requests.post(API_URL, headers=headers, json=data)

    response = Response(
        response=response.content, 
        status=response.status_code
    )

    response = utilities.handle_cors(request.origin, response)
    response.headers.add("access-control-expose-headers", "x-compute-type, x-compute-time")
    response.headers['content-type'] = 'image/jpeg'

    return response

@app.route('/create-subscription', methods=['POST'])
def create_subscription():
    data = json.loads(request.data)
    print(data['email'])

    customer = stripe.Customer.create(email=data['email'])

    price_id = config.STRIPE_SUBSCRIPTION_PRICE_ID

    try:
        # Create the subscription. Note we're expanding the Subscription's
        # latest invoice and that invoice's payment_intent
        # so we can pass it to the front end to confirm the payment
        subscription = stripe.Subscription.create(
            customer=customer.id,
            items=[{
                'price': price_id,
            }],
            payment_behavior='default_incomplete',
            payment_settings={'save_default_payment_method': 'on_subscription'},
            expand=['pending_setup_intent'],
        )
        print("sub id: ", subscription.id)
        print(subscription.pending_setup_intent.client_secret)
        response = jsonify(
            subscriptionID=subscription.id,
            subscriptionItemId=subscription['items'].data[0].id, 
            clientSecret=subscription.pending_setup_intent.client_secret
            )
        response = utilities.handle_cors(request.origin, response)

        return response

    except Exception as e:
        response = jsonify(error={'message': e.user_message}), 400
        response = utilities.handle_cors(request.origin, response)

        return response

def update_usage(subscription_id, usage_quantity):

    timestamp = int(time.time())

    try:
        stripe.SubscriptionItem.create_usage_record(
            subscription_id,
            quantity=usage_quantity,
            timestamp=timestamp,
            action='set',
        )

    except stripe.error.StripeError as e:
        print('Usage report failed for item ID %s with idempotency key: %s' %
        (subscription_id, e.error.message))
        pass

def log_usage_daily():
    docs = db.collection("subscriptions").stream()

    for doc in docs:
        usage = doc.to_dict()['subscriptionUsage']

        # print(doc.id, usage)
        update_usage(doc.id, usage)


@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        data = json.loads(request.data)
        userEmail = data['userEmail']

        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=utilities.get_price(data['item']),
            currency='usd',
            automatic_payment_methods={
                'enabled': True,
            },
            metadata={
                'userEmail': userEmail
            }
        )
        print("Success")
        response = jsonify({
            'clientSecret': intent['client_secret']
        })
        response = utilities.handle_cors(request.origin, response)
        return response
    except Exception as e:
        print("Fail")
        response = jsonify(error=str(e)), 403
        response = utilities.handle_cors(request.origin, response)

        return response

@app.route('/cancel-subscription', methods=['POST'])
def cancelSubscription():
    data = json.loads(request.data)
    subItemID = data['subscriptionItemID']
    usage = db.collection("subscriptions").document(subItemID).get().to_dict()['subscriptionUsage']
    update_usage(subItemID, usage)

    try:
         # Cancel the subscription by deleting it
        deletedSubscription = stripe.Subscription.delete(data['subscriptionId'], invoice_now=True)
        response = jsonify(deletedSubscription)
        response = utilities.handle_cors(request.origin, response)

        return response
    except Exception as e:
        print("error")
        return jsonify(error=str(e)), 403
    
@app.route('/get-subscription-due-date', methods=['POST'])
def getSubscriptionDueDate():
    data = json.loads(request.data)
    subID = data['subscriptionId']

    try:
        upcoming_invoice = stripe.Invoice.upcoming(subscription=subID)
        response = jsonify(date=upcoming_invoice['period_end'])
        
        response = utilities.handle_cors(request.origin, response)
        return response
    except Exception as e:
        return jsonify(error=str(e)), 403


@app.route('/webhook', methods=['POST'])
def webhook():
    event = None
    payload = request.data

    try:
        event = json.loads(payload)
    except:
        print('⚠️  Webhook error while parsing basic request.' + str(e))
        return jsonify(success=False)
    if endpoint_secret:
        # Only verify the event if there is an endpoint secret defined
        # Otherwise use the basic event deserialized with json
        sig_header = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except stripe.error.SignatureVerificationError as e:
            print('⚠️  Webhook signature verification failed.' + str(e))
            return jsonify(success=False)

    # Handle the event
    if event and event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']  # contains a stripe.PaymentIntent
        print('Payment for {} succeeded'.format(payment_intent['amount']))
        print(f"User: {payment_intent['metadata']['userEmail']}")
        doc = payment_intent['metadata']['userEmail']

        incrementBy = utilities.SMALL_PACKAGE_COUNT if payment_intent['amount'] == utilities.SMALL_PACKAGE_PRICE else utilities.LARGE_PACKAGE_COUNT
        ref = db.collection("users").document(doc)
        ref.update({"imageTokenCount": firestore.Increment(incrementBy)})

    elif event and event['type'] == 'setup_intent.succeeded':
        customer = event['data']['object']['customer']

        email = stripe.Customer.retrieve(customer)['email']

        ref = db.collection("users").document(email)
        ref.update({"subscriptionActive": True})

    elif event['type'] == 'invoice.paid':
        if event.data.object.total == 0:
            print("Total of 0 success")
            return jsonify(success=True)

        item_id = event.data.object.lines.data[0].subscription_item
        ref = db.collection("subscription").document(item_id)
        ref.update({"subscriptionUsage": 0})
        print("Reset Usage")

    elif event['type'] == 'customer.subscription.deleted':
        customer_key = event['data']['object']['customer']
        customer = stripe.Customer.retrieve(customer_key)
        email = customer.email

        ref = db.collection("users").document(email)
        doc = ref.get().to_dict()
        subItemID = doc['subscriptionItemID']

        ref.update({
            "subscriptionID": firestore.DELETE_FIELD,
            "subscriptionItemID": firestore.DELETE_FIELD,
            "subscriptionActive": False
        })

        db.collection("subscriptions").document(subItemID).delete()


    else:
        # Unexpected event type
        print('Unhandled event type {}'.format(event['type']))

    return jsonify(success=True)

if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=log_usage_daily, trigger="interval", hours=24)
    scheduler.start()
    app.run(port=4242)
    # app.run()