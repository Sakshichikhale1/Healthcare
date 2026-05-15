from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

class PatientBase(BaseModel):
    first_name: str
    last_name: str
    dob: Optional[datetime] = None
    gender: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    medical_history: Optional[Dict[str, Any]] = {}

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
