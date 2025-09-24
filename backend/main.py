
from fastapi import FastAPI
from data_loader import load_users, load_metrics

from routes.login import router as login_router
from routes.metrics import router as metrics_router
from routes.user import router as users_router

app = FastAPI(title="Case Estágio - Dashboard")

# Executar "uvicorn main:app --reload" para iniciar o servidor.

USERS_DF = load_users("../data/users.csv")
METRICS_DF = load_metrics("../data/metrics.csv")

app.state.USERS_DF = USERS_DF
app.state.METRICS_DF = METRICS_DF

app.include_router(login_router, tags=["auth"])
app.include_router(metrics_router, tags=["metrics"])
app.include_router(users_router, tags=["users"])
