from PIL import Image
import config
import io
import requests

#### API ####

API_URL = "https://api-inference.huggingface.co/models/jjcavallo5/generative_aac"
headers = {"Authorization": f"Bearer {config.HF_TOKEN}"}

def queryHFAPI(prompt):
    payload = {
        "inputs": prompt,
        "options": {
            "use_cache": False
        }
    }

    print("Payload generated")

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

    return io.BytesIO(response.content)