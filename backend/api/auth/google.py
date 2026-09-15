import time
import os
import secrets
from urllib.parse import urlencode

import jwt
import requests

from fastapi import HTTPException
from fastapi.responses import RedirectResponse

from database.queries.auth_queries import (
    get_user_by_provider,
    get_user_by_email,
    create_user
)


JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

# Temporary OAuth authorization codes
GOOGLE_AUTH_CODES = {}

# =========================================================
# GOOGLE OAUTH LOGIN
# =========================================================

def google_login():

    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_CLIENT_ID is not configured"
        )

    if not GOOGLE_REDIRECT_URI:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_REDIRECT_URI is not configured"
        )

    state = secrets.token_urlsafe(32)

    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "select_account",
    }

    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        + urlencode(params)
    )

    response = RedirectResponse(
        url=google_auth_url,
        status_code=302
    )

    response.set_cookie(
        key="google_oauth_state",
        value=state,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=600
    )

    return response


# =========================================================
# GOOGLE OAUTH CALLBACK
# =========================================================

def google_callback(code: str, state: str = None):

    if not code:
        raise HTTPException(
            status_code=400,
            detail="Google authorization code is missing"
        )

    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_CLIENT_ID is not configured"
        )

    if not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_CLIENT_SECRET is not configured"
        )

    if not GOOGLE_REDIRECT_URI:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_REDIRECT_URI is not configured"
        )

    # -----------------------------------------------------
    # Exchange authorization code for Google tokens
    # -----------------------------------------------------

    token_response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        },
        timeout=15
    )

    if token_response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Failed to exchange Google authorization code"
        )

    token_data = token_response.json()

    access_token = token_data.get("access_token")

    if not access_token:
        raise HTTPException(
            status_code=401,
            detail="Google access token was not returned"
        )

    # -----------------------------------------------------
    # Get Google user information
    # -----------------------------------------------------

    userinfo_response = requests.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
        timeout=15
    )

    if userinfo_response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Failed to retrieve Google account information"
        )

    google_user = userinfo_response.json()

    google_id = google_user.get("sub")
    email = google_user.get("email")
    name = google_user.get("name")

    if not google_id or not email:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google account information"
        )

    email = email.strip().lower()

    # -----------------------------------------------------
    # Find existing ScholarX user
    # -----------------------------------------------------

    user = get_user_by_provider(
        "google",
        google_id
    )

    if not user:
        user = get_user_by_email(email)

    # -----------------------------------------------------
    # Create ScholarX user if necessary
    # -----------------------------------------------------

    if not user:

        user_id = create_user(
            name=name or "Google User",
            email=email,
            password_hash=None,
            role="student",
            auth_provider="google",
            provider_id=google_id
        )

        user = {
            "id": user_id,
            "name": name or "Google User",
            "email": email,
            "role": "student"
        }

    # -----------------------------------------------------
    # Generate ScholarX JWT
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # Redirect back to React
    # -----------------------------------------------------

    auth_code = secrets.token_urlsafe(48)

    GOOGLE_AUTH_CODES[auth_code] = {
    "token": token,
    "user": {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    },
    "expires_at": time.time() + 60
    }

    redirect_url = (
        f"{FRONTEND_URL}/oauth/google/callback?"
        f"code={auth_code}"
    )

    return RedirectResponse(
        url=redirect_url,
        status_code=302
    )

def exchange_google_code(code: str):

    if not code:
        raise HTTPException(
            status_code=400,
            detail="OAuth code is required"
        )

    auth_data = GOOGLE_AUTH_CODES.get(code)

    if not auth_data:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired OAuth code"
        )

    # Remove immediately so the code can only be used once
    del GOOGLE_AUTH_CODES[code]

    if time.time() > auth_data["expires_at"]:
        raise HTTPException(
            status_code=401,
            detail="OAuth code has expired"
        )

    return {
        "status": 200,
        "message": "Google login successful",
        "token": auth_data["token"],
         "user": auth_data["user"]
    }