
import pandas as pd
import jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import bcrypt
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Depends


SECRET_KEY = "test_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()


def load_users_df(path):
    return pd.read_csv(path)


def authenticate_user(users_df, email, password):
    u = users_df[users_df["email"] == email]
    if u.empty:
        return None
    u = u.iloc[0]
    hashed = u["password_hash"]

    if bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8")):
        return {"email": u["email"], "role": u["role"], "name": u.get("name", "")}
    return None


def create_access_token(data: dict, expires_delta: int = 30):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    encoded = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")
