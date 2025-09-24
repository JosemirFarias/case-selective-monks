
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from data_loader import load_users
from auth import create_access_token, authenticate_user, load_users, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()
USERS_PATH = "../data/users.csv"


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(req: LoginRequest):
    users_df = load_users(USERS_PATH)
    user = authenticate_user(users_df, req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_access_token(
        data={"email": user["email"], "role": user["role"]},
        expires_delta=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return {"access_token": token, "token_type": "bearer", "role": user["role"]}
