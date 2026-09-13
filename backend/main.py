from dotenv import load_dotenv
load_dotenv()


from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth.router import router as auth_router


app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

home_router = APIRouter(tags=["Health Check"])
@home_router.get("/")
async def home_check():
    return {
        "status": "healthy",
        "message": "FastAPI application is running successfully"
    }

app.include_router(home_router)

app.include_router(auth_router)

