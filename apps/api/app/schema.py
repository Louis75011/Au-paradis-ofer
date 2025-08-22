import datetime as dt
import strawberry
from typing import List
from sqlalchemy.orm import Session as SASession

from .db import SessionLocal
from . import models
from .emailer import send_mail

# ✦ Types GraphQL (simples pour MVP)

@strawberry.type
class SessionType:
    id: int
    name: str
    duration_minutes: int
    price_eur: float

@strawberry.type
class BookingType:
    id: int
    status: str

@strawberry.input
class BookingInput:
    fullName: str
    email: str
    date: dt.date
    sessionId: int

@strawberry.type
class PaymentResult:
    id: str
    status: str
    amount_eur: float

def seed_if_empty(db: SASession):
    """Insère quelques séances si la table est vide (utilitaire dev)."""
    if not db.query(models.Session).first():
        db.add_all(
            [
                models.Session(name="Séance individuelle", duration_minutes=60, price_eur=50),
                models.Session(name="Forfait 5 séances", duration_minutes=60, price_eur=225),
                models.Session(name="Séance 2 personnes", duration_minutes=75, price_eur=80),
            ]
        )
        db.commit()

@strawberry.type
class Query:
    @strawberry.field
    def health(self) -> str:
        return "ok"

    @strawberry.field
    def sessions(self) -> List[SessionType]:
        with SessionLocal() as db:
            seed_if_empty(db)
            data = db.query(models.Session).all()
            return [SessionType(id=s.id, name=s.name, duration_minutes=s.duration_minutes, price_eur=float(s.price_eur)) for s in data]

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def request_booking(self, input: BookingInput) -> BookingType:
        """Enregistre une demande et envoie un e-mail de confirmation (ou simulation en dev)."""
        with SessionLocal() as db:
            booking = models.Booking(
                full_name=input.fullName,
                email=input.email,
                date=input.date,
                session_id=input.sessionId,
                status="RECEIVED"
            )
            db.add(booking)
            db.commit()
            db.refresh(booking)

        await send_mail(
            "Demande de réservation Au Paradis O'Fer",
            input.email,
            f"Bonjour {input.fullName},\n\nVotre demande pour le {input.date} a bien été reçue.\nNous revenons vers vous rapidement."
        )
        return BookingType(id=booking.id, status=booking.status)

    @strawberry.mutation
    def simulate_payment(self, amount_eur: float) -> PaymentResult:
        """Simulation d'un paiement (pour tests front)."""
        return PaymentResult(id="PAY_FAKE_001", status="FAKE_OK", amount_eur=amount_eur)

schema = strawberry.Schema(query=Query, mutation=Mutation)
