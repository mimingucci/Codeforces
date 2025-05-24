import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Code Suggestion API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model and tokenizer
logger.info("Loading model and tokenizer...")

# Initialize model and tokenizer
MODEL_NAME = "bigcode/starcoderbase-1b"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16,  # Use half precision to save memory
    device_map="auto"  # Automatically determine device placement
)

# Set padding token if needed
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token


# Define request model
class SuggestionRequest(BaseModel):
    code: str
    max_length: int = 50
    temperature: float = 0.7
    language: str = "java"  # Can be used to filter suggestions


# Define response model
class SuggestionResponse(BaseModel):
    suggestion: str
    full_text: str


@app.post("/suggest", response_model=SuggestionResponse)
async def suggest_code(request: SuggestionRequest):
    try:
        logger.info(f"Received suggestion request for language: {request.language}")

        # Encode the input
        inputs = tokenizer(
            request.code,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512
        ).to(model.device)

        # Generate output
        with torch.no_grad():
            outputs = model.generate(
                inputs.input_ids,
                attention_mask=inputs.attention_mask,
                max_new_tokens=request.max_length,
                do_sample=True,
                temperature=request.temperature,
                top_p=0.95,
                num_return_sequences=1,
                pad_token_id=tokenizer.pad_token_id
            )

        # Decode the output
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

        # Extract only the newly generated part
        suggestion = generated_text[len(request.code):] if generated_text.startswith(request.code) else generated_text

        logger.info("Successfully generated suggestion")
        return SuggestionResponse(
            suggestion=suggestion,
            full_text=generated_text
        )

    except Exception as e:
        logger.error(f"Error generating suggestion: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "healthy", "model": MODEL_NAME}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)