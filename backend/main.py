
import pandas as pd
from fastapi import Depends, FastAPI, HTTPException, Request
from data_loader import load_users, load_metrics
from fastapi.security import OAuth2PasswordRequestForm
from auth import create_access_token, authenticate_user, get_current_user
from datetime import datetime, timedelta

app = FastAPI()

# Executar "uvicorn main:app --reload" para iniciar o servidor.

USERS_DF = load_users("../data/users.csv")
METRICS_DF = load_metrics("../data/metrics.csv")


@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(USERS_DF, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"email": user["email"], "role": user["role"]}
                                )
    return {"access_token": token, "token_type": "bearer", "role": user["role"]}
