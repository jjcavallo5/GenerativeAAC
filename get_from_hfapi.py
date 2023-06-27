import argparse
import config
import io
from PIL import Image
import requests

#### ARGS ####
parser = argparse.ArgumentParser()
parser.add_argument(
	'-p',
	'--prompt',
	required=True,
	type=str,
    help="Prompt for image generation"
)
parser.add_argument(
    '-n',
    '--name',
    type=str,
    default='output',
    help="Name of output file"
)
args = parser.parse_args()

#### API ####

API_URL = "https://api-inference.huggingface.co/models/jjcavallo5/generative_aac"
headers = {"Authorization": f"Bearer {config.HF_TOKEN}"}

def query(prompt):

    payload = {
        "inputs": prompt,
        "options": {
            "use_cache": False
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)
    if response.status_code == 503:
        print("Waiting for model to load...")
        payload = {
            "inputs": prompt,
            "options": {
                "wait_for_model": True,
                "use_cache": False
            }
        }
        response = requests.post(API_URL, headers=headers, json=payload)


    return response.content


image_bytes = query(args.prompt)

image = Image.open(io.BytesIO(image_bytes))
image.save(f'{args.name}.png')