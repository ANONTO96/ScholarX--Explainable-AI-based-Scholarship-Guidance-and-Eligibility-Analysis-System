from fastapi import APIRouter, FastAPI

from api.auth.router import router as auth_router


app = FastAPI()

home_router = APIRouter(tags=["Health Check"])
@home_router.get("/")
async def home_check():
    return {
        "status": "healthy",
        "message": "FastAPI application is running successfully"
    }

app.include_router(home_router)

app.include_router(auth_router)

