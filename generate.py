import argparse
from diffusers import StableDiffusionPipeline
import torch

#### ARGS ####
parser = argparse.ArgumentParser()

parser.add_argument(
    '-p',
    '--prompt',
    type=str,
    required=True,
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

#### GENERATION ####
DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'

model_path = "path_to_saved_model"
model_id = "CompVis/stable-diffusion-v1-4" # Temp
pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipe.to(DEVICE)

image = pipe(prompt=args.prompt).images[0]
image.save(f"{args.name}.png")