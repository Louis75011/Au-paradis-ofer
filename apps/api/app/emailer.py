import aiosmtplib
from email.message import EmailMessage
from .config import settings

async def send_mail(subject: str, to: str, body: str) -> None:
    """Envoi SMTP simple (asynchrone). En dev, on peut remplacer par un log."""
    if not settings.smtp_host or not settings.smtp_user or not settings.smtp_pass:
        # Environnement non configuré : on simule l'envoi
        print("[MAIL SIMULATION]", subject, to, body[:120], "...")
        return

    msg = EmailMessage()
    msg["From"] = settings.mail_from
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)

    await aiosmtplib.send(
        msg,
        hostname=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.smtp_user,
        password=settings.smtp_pass,
        use_tls=True,
    )
