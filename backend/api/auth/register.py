
import os
import re
import secrets
import bcrypt
import jwt
import logging

logger = logging.getLogger(__name__)

from database.queries.auth_queries import (
    create_student_profile,
    get_user_by_email,
    create_user,
    get_user_by_username,
)


JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


def generate_username(name):
    """
    Generate a username from the last name and a random number.
    Example: Abdullah Al Nafiu -> nafiu4827
    """
    parts = name.strip().split()
    last_name = parts[-1] if parts else "student"

    # Keep letters and numbers only; usernames are lowercase.
    last_name = re.sub(r"[^a-zA-Z0-9]", "", last_name).lower()
    last_name = last_name or "student"

    # Retry if the username already exists.
    for _ in range(10):
        username = f"{last_name}{secrets.randbelow(9000) + 1000}"

        if not get_user_by_username(username):
            return username

    raise RuntimeError("Could not generate a unique username")


def register_user(name, email, password):
    if not name or not email or not password:
        return {
            "status": 400,
            "message": "Name, email and password are required"
        }

    name = name.strip()
    email = email.strip().lower()

    if len(password) < 6:
        return {
            "status": 400,
            "message": "Password must contain at least 6 characters"
        }

    if get_user_by_email(email):
        return {
            "status": 409,
            "message": "Email already registered"
        }

    password_hash = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    try:
        username = generate_username(name)

        user_id = create_user(
        name=name,
        email=email,
        password_hash=password_hash,
        role="student",
        auth_provider="local",
        provider_id=None,
        username=username
        )

        create_student_profile(user_id)

    except RuntimeError as error:
        logger.exception("Registration runtime error")
        return {
            "status": 500,
            "message": str(error)
        }

    except Exception:
        # Log the actual exception on the server in production.
        # Do not expose database details to the client.
        logger.exception("Registration failed unexpectedly")
        return {
            "status": 500,
            "message": "Could not create the account. Please try again."
        }

    payload = {
        "user_id": user_id,
        "email": email,
        "role": "student"
    }

    token = jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )

    return {
        "status": 201,
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "username": username,
            "email": email,
            "role": "student"
        }
    }
