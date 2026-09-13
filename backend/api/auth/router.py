from fastapi import APIRouter

from api.auth.register import register_user
from api.auth.login import login_user
from database.schema.auth_schemas import RegisterRequest,LoginRequest


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/")
def home():
    return {"message": "Welcome to the Authentication API!"}



@router.post("/register")
def register(data: RegisterRequest):

    return register_user(
        data.name,
        data.email,
        data.password
    )

@router.post("/login")
def login(data: LoginRequest):
    
    return login_user(
        data.email,
        data.password
    )