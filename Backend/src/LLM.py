from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

api = FastAPI()

model = AutoModelForCausalLM.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")
tokenizer = AutoTokenizer.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    utterance: str

@api.post("/predict")
async def predict(utterance: PredictRequest):
    try:
        generator = pipeline("text-generation", model=model, tokenizer=tokenizer)
        answer = generator(utterance.utterance, max_new_tokens=50)[0]['generated_text']
        print(answer)
        return {"text": answer}
    except Exception as e:
        print(e)