import os
import bcrypt
import jwt

from database.queries.auth_queries import (
    get_user_by_email,
    create_user
)


JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")


def register_user(name, email, password):

    # --------------------------------------------------------
    # Validate input
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Check existing user
    # --------------------------------------------------------

    existing_user = get_user_by_email(email)

    if existing_user:
        return {
            "status": 409,
            "message": "Email already registered"
        }

    # --------------------------------------------------------
    # Hash password
    # --------------------------------------------------------

    password_hash = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    # --------------------------------------------------------
    # Create user
    # --------------------------------------------------------

    user_id = create_user(
        name,
        email,
        password_hash,
        "student"
    )

    # --------------------------------------------------------
    # Generate JWT
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Return response
    # --------------------------------------------------------

    return {
        "status": 201,
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "role": "student"
        }
    }