import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ClinicOS AI",
    description="Multi-agent healthcare operating system API",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in origins else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.database.connection import engine
from app.models.schema import Base

# Auto-create tables on startup
Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "ClinicOS AI Backend is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

from app.api.router import api_router
from app.api.websockets import router as websocket_router

app.include_router(api_router, prefix="/api/v1")
app.include_router(websocket_router, prefix="/ws", tags=["Websockets"])
