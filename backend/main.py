from dotenv import load_dotenv
load_dotenv()


from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth.router import router as auth_router
from database.connection import get_db_connection


app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173","https://scholarx-web.vercel.app"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

home_router = APIRouter(tags=["Health Check"])
@home_router.get("/")
async def home_check():
    return {
        "status": "healthy",
        "message": "FastAPI application is running successfully. For API documentation and testing is available at /docs"
    }

@app.get("/test-db")
def test_database():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT 1")
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "database": "connected",
            "result": result
        }

    except Exception as e:
        return {
            "status": "error",
            "database": "connection_failed",
            "error": str(e)
        }


app.include_router(home_router)

app.include_router(auth_router)

