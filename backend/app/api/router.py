from fastapi import APIRouter
from app.api import patients, upload, agents, consultations, auth, analytics, websockets

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
api_router.include_router(upload.router, prefix="/upload", tags=["Uploads"])
api_router.include_router(agents.router, prefix="/agents", tags=["Agents"])
api_router.include_router(consultations.router, prefix="/consultations", tags=["Consultations"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(websockets.router, prefix="/ws", tags=["Websockets"])
