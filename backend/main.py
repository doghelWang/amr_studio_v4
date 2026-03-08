import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from schemas.api import GeneratePayload
from core.protobuf_engine import generate_industrial_modelset

app = FastAPI(title="AMR Config Studio API", version="2.0")

# Enable CORS for local Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/generate")
async def generate_model_set(payload: GeneratePayload):
    try:
        # Pass the strict Pydantic payload directly to the engine
        zip_path = generate_industrial_modelset(payload)
        
        # Determine original model name for filename
        filename = f"{payload.robotName.replace(' ', '_')}_ModelSet.zip"
        
        return FileResponse(
            path=zip_path,
            filename=filename,
            media_type="application/zip"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("Starting Industrial AMR Studio API on port 8000...")
    uvicorn.run(app, host="127.0.0.1", port=8000)
