from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseModel):
    app_env: str = os.getenv("APP_ENV", "dev")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
    cors_origins: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    smtp_host: str | None = os.getenv("SMTP_HOST")
    smtp_port: int | None = int(os.getenv("SMTP_PORT", "465"))
    smtp_user: str | None = os.getenv("SMTP_USER")
    smtp_pass: str | None = os.getenv("SMTP_PASS")
    mail_from: str = os.getenv("MAIL_FROM", "Au Paradis O'Fer <au.paradis.o.fer@gmail.com>")

settings = Settings()
