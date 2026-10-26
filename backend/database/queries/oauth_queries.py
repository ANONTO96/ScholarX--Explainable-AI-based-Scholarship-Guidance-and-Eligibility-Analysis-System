
import hashlib
from datetime import datetime, timedelta, timezone

from database.connection import get_db_connection


EXCHANGE_CODE_TTL_SECONDS = 60


def _hash_code(code: str) -> str:
    """Hash the temporary code before storing it in MySQL."""
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


def store_oauth_exchange_code(user_id: int, code: str) -> bool:
    """
    Store a hashed, short-lived OAuth exchange code.
    Multiple codes per user are allowed.
    """
    code_hash = _hash_code(code)
    expires_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(
        seconds=EXCHANGE_CODE_TTL_SECONDS
    )

    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO oauth_exchange_codes
                (user_id, code_hash, expires_at)
            VALUES (%s, %s, %s)
            """,
            (user_id, code_hash, expires_at),
        )
        connection.commit()
        return True

    except Exception:
        connection.rollback()
        raise

    finally:
        if cursor is not None:
            cursor.close()
        connection.close()


def consume_oauth_exchange_code(code: str):
    """
    Consume a code once and return its user_id.
    Returns None if the code is invalid, expired, or already used.
    """
    code_hash = _hash_code(code)
    connection = get_db_connection()
    cursor = None

    try:
        connection.start_transaction()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, user_id, expires_at
            FROM oauth_exchange_codes
            WHERE code_hash = %s
            FOR UPDATE
            """,
            (code_hash,),
        )
        row = cursor.fetchone()

        if row is None:
            connection.rollback()
            return None

        # Delete the row whether valid or expired, so it cannot be reused.
        cursor.execute(
            "DELETE FROM oauth_exchange_codes WHERE id = %s",
            (row["id"],),
        )

        expires_at = row["expires_at"]
        if expires_at.tzinfo is not None:
            expires_at = expires_at.replace(tzinfo=None)

        if expires_at <= datetime.now(timezone.utc).replace(tzinfo=None):
            connection.commit()
            return None

        user_id = row["user_id"]
        connection.commit()
        return user_id

    except Exception:
        connection.rollback()
        raise

    finally:
        if cursor is not None:
            cursor.close()
        connection.close()
