import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback to SQLite for local development if PostgreSQL fails
if not DATABASE_URL or "your_supabase_url" in DATABASE_URL or "db.supabase.co" in DATABASE_URL:
    DATABASE_URL = "sqlite:///./clinicos.db"
    print("WARNING: Using local SQLite database as fallback")

try:
    if DATABASE_URL.startswith("sqlite"):
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(DATABASE_URL)
    
    # Test connection
    with engine.connect() as conn:
        pass
except Exception as e:
    print(f"Error connecting to {DATABASE_URL}: {e}")
    DATABASE_URL = "sqlite:///./clinicos.db"
    print("Falling back to SQLite...")
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
