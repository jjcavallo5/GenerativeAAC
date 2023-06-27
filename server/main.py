from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import config
from pydantic import BaseModel

from queryAPI import queryHFAPI

app = FastAPI()

ORIGINS = "http://127.0.0.1:5500:*"

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerativeAACRequest(BaseModel):
    prompt: str

@app.post("/")
async def root(req: GenerativeAACRequest):
    img_data = queryHFAPI(req.prompt)

    return StreamingResponse(content=img_data, media_type='image/png')
