from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Numeric
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class Patient(Base):
    __tablename__ = 'patients'
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    dob = Column(DateTime)
    gender = Column(String)
    contact_number = Column(String)
    email = Column(String, unique=True, index=True)
    address = Column(Text)
    medical_history = Column(JSON, default={})
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    appointments = relationship("Appointment", back_populates="patient")

class Appointment(Base):
    __tablename__ = 'appointments'
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    provider_id = Column(Integer) # Could link to a Users/Providers table
    appointment_date = Column(DateTime)
    status = Column(String) # scheduled, completed, cancelled
    reason = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    patient = relationship("Patient", back_populates="appointments")
    consultation = relationship("Consultation", back_populates="appointment", uselist=False)

class Consultation(Base):
    __tablename__ = 'consultations'
    
    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey('appointments.id'))
    status = Column(String) # ongoing, completed
    notes = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    appointment = relationship("Appointment", back_populates="consultation")
    soap_note = relationship("SoapNote", back_populates="consultation", uselist=False)
    transcript = relationship("Transcript", back_populates="consultation", uselist=False)

class SoapNote(Base):
    __tablename__ = 'soap_notes'
    
    id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey('consultations.id'))
    subjective = Column(Text)
    objective = Column(Text)
    assessment = Column(Text)
    plan = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    consultation = relationship("Consultation", back_populates="soap_note")

class Transcript(Base):
    __tablename__ = 'transcripts'
    
    id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey('consultations.id'))
    text = Column(Text)
    audio_url = Column(String)
    created_at = Column(DateTime, default=func.now())

    consultation = relationship("Consultation", back_populates="transcript")

class BillingRecord(Base):
    __tablename__ = 'billing_records'
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    appointment_id = Column(Integer, ForeignKey('appointments.id'))
    amount = Column(Numeric(10, 2))
    status = Column(String) # pending, paid, overdue
    codes = Column(JSON, default=[]) # CPT/ICD codes
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class FollowUp(Base):
    __tablename__ = 'followups'
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    consultation_id = Column(Integer, ForeignKey('consultations.id'))
    scheduled_date = Column(DateTime)
    status = Column(String) # pending, completed, cancelled
    notes = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class AgentLog(Base):
    __tablename__ = 'agent_logs'
    
    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String)
    action = Column(String)
    details = Column(JSON)
    status = Column(String) # success, failed
    created_at = Column(DateTime, default=func.now())

class UploadedReport(Base):
    __tablename__ = 'uploaded_reports'
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    file_name = Column(String)
    file_url = Column(String)
    file_type = Column(String)
    extracted_data = Column(JSON)
    created_at = Column(DateTime, default=func.now())

class Analytics(Base):
    __tablename__ = 'analytics'
    
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String)
    metric_value = Column(Numeric)
    date = Column(DateTime, default=func.now())
    dimensions = Column(JSON)
