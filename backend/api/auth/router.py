import code

from fastapi import APIRouter

from api.auth.register import register_user
from api.auth.login import login_user
from api.auth.google import exchange_google_code, google_callback, google_login
from database.schema.auth_schemas import GoogleExchangeRequest, RegisterRequest,LoginRequest


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

@router.get("/google/login")
def google_login_route():
    return google_login()


@router.get("/google/callback")
def google_callback_route(code: str, state: str = None):
    return google_callback(code, state)


@router.post("/google/exchange")
def google_exchange_route(data: GoogleExchangeRequest):
    return exchange_google_code(data.code)