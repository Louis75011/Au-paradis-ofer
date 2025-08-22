from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# Création du moteur SQLAlchemy (SQLite en dev ; PostgreSQL en prod)
engine = create_engine(settings.database_url, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()

def init_db():
    from . import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
