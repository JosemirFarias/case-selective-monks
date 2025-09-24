
from fastapi import APIRouter, Depends
from auth import get_current_user

router = APIRouter()


@router.get("/me")
def users_me(current_user: dict = Depends(get_current_user)):
    return {
        "email": current_user.get("email"),
        "role": current_user.get("role"),
        "name": current_user.get("name", "")
    }
