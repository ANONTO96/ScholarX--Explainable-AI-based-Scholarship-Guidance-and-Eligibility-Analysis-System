import os
import bcrypt
import jwt

from database.queries.auth_queries import get_user_by_email


JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")


def login_user(email, password):

    if not email or not password:
        return {
            "status": 400,
            "message": "Email and password are required"
        }

    email = email.strip().lower()

    user = get_user_by_email(email)

    print(f"User fetched from database: {user}")  # Debugging line

    if not user:
        return {
            "status": 401,
            "message": "Invalid email or password"
        }

    password_match = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password_hash"].encode("utf-8")
    )

    print(f"Password match: {password_match}")  # Debugging line

    if not password_match:
        return {
            "status": 401,
            "message": "Invalid email or password"
        }

    payload = {
        "user_id": user["id"],
        "email": user["email"],
        "role": user["role"]
    }

    token = jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )

    return {
        "status": 200,
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }