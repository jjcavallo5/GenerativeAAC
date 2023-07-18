import json
import time
from flask import Flask, Response, request, jsonify
import config
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
from apscheduler.schedulers.background import BackgroundScheduler

cred = credentials.Certificate('service-account-key.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()

import stripe

stripe.api_key = config.STRIPE_API_SECRET_KEY

app = Flask(__name__,
            static_url_path='',
            static_folder='public')

DOMAINS = ['https://generativeaac.com', 'http://localhost:3000']
SMALL_PACKAGE_PRICE = 1000
LARGE_PACKAGE_PRICE = 2500
SMALL_PACKAGE_COUNT = 500
LARGE_PACKAGE_COUNT = 1500

def get_price(item):
    if item == 'smallImagePackage':
        return SMALL_PACKAGE_PRICE
    elif item == 'largeImagePackage':
        return LARGE_PACKAGE_PRICE
    
def handle_cors(request_origin, response):
    if request_origin in DOMAINS:
        response.headers.add('Access-Control-Allow-Origin', request_origin)
        return response

    else:
        return response

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        print("options req")
        res = Response()
        res = handle_cors(request.origin, res)
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

    response = handle_cors(request.origin, response)
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
        print(subscription.pending_setup_intent.client_secret)
        response = jsonify(subscriptionId=subscription['items'].data[0].id, clientSecret=subscription.pending_setup_intent.client_secret)
        response = handle_cors(request.origin, response)

        return response

    except Exception as e:
        response = jsonify(error={'message': e.user_message}), 400
        response = handle_cors(request.origin, response)

        return response



# @app.route('/update-usage', methods=['POST'])
# def update_usage():
#     data = json.loads(request.data)
#     subscription_item_id = data['subscription_id']
#     usage_quantity = data['usage']

#     timestamp = int(time.time())

#     try:
#         stripe.SubscriptionItem.create_usage_record(
#             subscription_item_id,
#             quantity=usage_quantity,
#             timestamp=timestamp,
#             action='increment',
#         )
#         print("Updated state")
#         response = Response()
#         response.headers.add('Access-Control-Allow-Origin', f'{DOMAIN}')
#         return response
#     except stripe.error.StripeError as e:
#         print('Usage report failed for item ID %s with idempotency key: %s' %
#         (subscription_item_id, e.error.message))
#         pass

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
            amount=get_price(data['item']),
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
        response = handle_cors(request.origin, response)
        return response
    except Exception as e:
        print("Fail")
        response = jsonify(error=str(e)), 403
        response = handle_cors(request.origin, response)

        return response


endpoint_secret = config.STRIPE_WEBHOOK_ENDPOINT_SECRET

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

        incrementBy = SMALL_PACKAGE_COUNT if payment_intent['amount'] == SMALL_PACKAGE_PRICE else LARGE_PACKAGE_COUNT
        ref = db.collection("users").document(doc)
        ref.update({"imageTokenCount": firestore.Increment(incrementBy)})

    elif event['type'] == 'invoice.paid':
        if event.data.object.total == 0:
            print("Total of 0 success")
            return jsonify(success=True)

        item_id = event.data.object.lines.data[0].subscription_item
        ref = db.collection("subscription").document(item_id)
        ref.update({"subscriptionUsage": 0})
        print("Reset Usage")

        # handle_payment_method_attached(payment_method)
    else:
        # Unexpected event type
        print('Unhandled event type {}'.format(event['type']))

    return jsonify(success=True)

if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=log_usage_daily, trigger="interval", hours=1)
    scheduler.start()
    app.run(port=4242)
    # app.run()