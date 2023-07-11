import json
from flask import Flask, Response, request, jsonify
import config
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests

cred = credentials.Certificate('server/service-account-key.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()

import stripe

stripe.api_key = config.STRIPE_API_SECRET_KEY

app = Flask(__name__,
            static_url_path='',
            static_folder='public')

DOMAIN = 'http://localhost:3000'
SMALL_PACKAGE_PRICE = 1000
LARGE_PACKAGE_PRICE = 2500
SMALL_PACKAGE_COUNT = 500
LARGE_PACKAGE_COUNT = 1500

def get_price(item):
    if item == 'smallImagePackage':
        return SMALL_PACKAGE_PRICE
    elif item == 'largeImagePackage':
        return LARGE_PACKAGE_PRICE

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        print("options req")
        res = Response()
        res.headers.add('Access-Control-Allow-Origin', f'{DOMAIN}')
        res.headers.add('Access-Control-Allow-Headers', 'Content-Type')

        return res
    
@app.route('/hugging-face-api', methods=['POST'])
def hugging_face_api():
    data = json.loads(request.data)
    API_URL = "https://api-inference.huggingface.co/models/jjcavallo5/generative_aac"
    headers = {"Authorization": f"Bearer {config.HF_API_KEY}"}

    print("Before")
    response = requests.post(API_URL, headers=headers, json=data)
    print("AFter")

    response = Response(
        response=response.content, 
        status=response.status_code
    )

    response.headers.add('Access-Control-Allow-Origin', DOMAIN)
    response.headers.add("access-control-expose-headers", "x-compute-type, x-compute-time")
    return response


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
        response.headers.add('Access-Control-Allow-Origin', f'{DOMAIN}')
        return response
    except Exception as e:
        print("Fail")
        response = jsonify(error=str(e)), 403
        response.headers.add('Access-Control-Allow-Origin', f'{DOMAIN}')

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
        print(incrementBy)
        ref = db.collection("users").document(doc)
        ref.update({"imageTokenCount": firestore.Increment(incrementBy)})

    elif event['type'] == 'payment_method.attached':
        payment_method = event['data']['object']  # contains a stripe.PaymentMethod
        # Then define and call a method to handle the successful attachment of a PaymentMethod.
        # handle_payment_method_attached(payment_method)
    else:
        # Unexpected event type
        print('Unhandled event type {}'.format(event['type']))

    return jsonify(success=True)

if __name__ == '__main__':
    app.run(port=4242)