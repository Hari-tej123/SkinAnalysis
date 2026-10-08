import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Default to SQLite for zero-config local runs, or use provided DATABASE_URL (e.g. Postgres in Docker)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./skin_ai.db"
)

# SQLite needs check_same_thread=False
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    # Test connection
    with engine.connect() as conn:
        pass
except Exception as e:
    # If postgres connection fails, fallback to local sqlite
    print(f"Warning: Failed to connect to {DATABASE_URL} ({e}). Falling back to SQLite.")
    DATABASE_URL = "sqlite:///./skin_ai.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()