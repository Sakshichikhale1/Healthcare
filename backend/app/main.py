from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ClinicOS AI",
    description="Multi-agent healthcare operating system API",
    version="1.0.0"
)

import os

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins[0] != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.database.connection import engine
from app.models.schema import Base

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "Welcome to ClinicOS AI Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

from app.api.router import api_router
from app.api.websockets import router as websocket_router

app.include_router(api_router, prefix="/api/v1")
app.include_router(websocket_router, prefix="/ws", tags=["Websockets"])
