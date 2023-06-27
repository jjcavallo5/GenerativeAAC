import requests
from PIL import Image
from io import BytesIO

HEADERS = {'Content-Type': 'application/json'}
PAYLOAD = {"prompt": "aac symbol of a dog"}
response = requests.post('http://127.0.0.1:8080/', headers=HEADERS, json=PAYLOAD)
img = Image.open(BytesIO(response.content))
img.show()