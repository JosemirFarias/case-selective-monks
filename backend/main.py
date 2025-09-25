
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd


app = FastAPI(title="Case Estágio - Dashboard")

# Permissão para o frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Apenas para testes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Executar "uvicorn main:app --reload" para iniciar o servidor.


class LoginRequest(BaseModel):
    email: str
    password: str


class MetricRequest(BaseModel):
    start_date: str = None
    end_date: str = None
    sort_by: str = None
    sort_order: str = "asc"  # "asc" ou "desc"
    role: str = "user"  # "admin" ou "user"


def load_users():
    return pd.read_csv('users.csv')


def load_metrics():
    return pd.read_csv('metrics.csv')


@app.post("/login")
def login(req: LoginRequest):
    users = load_users()
    user = users[(users['email'] == req.email) &
                 (users['password'] == req.password)]
    if not user.empty:
        return {"sucess": True, "role": user.iloc[0]['role']}
    raise HTTPException(status_code=401, detail="Usuário ou senha inválidos")


@app.post("/metrics")
def get_metrics(request: MetricRequest):
    metrics = pd.read_csv('metrics.csv')

    # Filtrar datas
    if request.start_date:
        metrics = metrics[metrics['date'] >= request.start_date]
    if request.end_date:
        metrics = metrics[metrics['date'] <= request.end_date]

    # Ordenação
    if request.sort_by and request.sort_by in metrics.columns:
        metrics = metrics.sort_values(
            by=request.sort_by, ascending=(request.sort_order == "asc"))

    # Esconder cost_micros se não for admin
    if request.role != "admin" and "cost_micros" in metrics.columns:
        metrics = metrics.drop(columns=["cost_micros"])
    return metrics.to_dict(orient="records")
