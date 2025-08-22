from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from .schema import schema
from .db import init_db
from .config import settings

# Application FastAPI
app = FastAPI(title="Au Paradis O'Fer API", version="0.1.0")

# CORS restreint aux origines configurées
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation DB au démarrage (dev)
@app.on_event("startup")
def on_startup():
    init_db()

# Route GraphQL
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

@app.get("/healthz")
def healthz():
    return {"status": "ok"}
