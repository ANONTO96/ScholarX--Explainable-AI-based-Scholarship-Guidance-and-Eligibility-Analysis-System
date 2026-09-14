import os

from google.oauth2 import id_token
from google.auth.transport import requests

import jwt

from database.queries.auth_queries import (
    get_user_by_provider,
    get_user_by_email,
    create_user
)

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


def login_with_google(credential):

    if not credential:
        return {"status": 400, "message": "Google credential is required"}

    try:
        google_user = id_token.verify_oauth2_token(credential, requests.Request(), GOOGLE_CLIENT_ID)
    except ValueError:
        return {"status": 401, "message": "Invalid Google credential"}

    google_id = google_user.get("sub")
    email = google_user.get("email")
    name = google_user.get("name")

    if not google_id or not email:
        return {"status": 401, "message": "Invalid Google account information"}

    email = email.strip().lower()
    user = get_user_by_provider("google", google_id)

    if not user:
        user = get_user_by_email(email)

    if not user:
        user_id = create_user(
            name=name or "Google User",
            email=email,
            password_hash=None,
            role="student",
            auth_provider="google",
            provider_id=google_id
        )
        
        user = {"id": user_id, "name": name or "Google User", "email": email, "role": "student"}

    # Generate your application's JWT
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

    # print(f"User {user['email']} logged in with Google. JWT: {token}")

    return {
        "status": 200,
        "message": "Google login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }