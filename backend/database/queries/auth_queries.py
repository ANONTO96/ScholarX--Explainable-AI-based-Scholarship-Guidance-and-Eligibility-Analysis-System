from database.connection import get_db_connection


def get_user_by_id(user_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, name, username, email, role
            FROM users
            WHERE id = %s
            LIMIT 1
            """,
            (user_id,),
        )
        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def update_username(user_id: int, username: str):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE username = %s AND id != %s
            LIMIT 1
            """,
            (username, user_id),
        )

        if cursor.fetchone():
            return {
                "success": False,
                "message": "Username is already taken.",
            }

        cursor.execute(
            """
            UPDATE users
            SET username = %s
            WHERE id = %s
            """,
            (username, user_id),
        )

        if cursor.rowcount == 0:
            cursor.execute(
                "SELECT id FROM users WHERE id = %s",
                (user_id,),
            )
            if not cursor.fetchone():
                return {
                    "success": False,
                    "message": "User not found.",
                }

        connection.commit()

        return {
            "success": True,
            "username": username,
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()


def get_user_by_email(email):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT
                id, name, username, email,
                password_hash, role,
                auth_provider, provider_id
            FROM users
            WHERE email = %s
            LIMIT 1
            """,
            (email,)
        )
        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def get_user_by_username(username):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, name, username, email, role
            FROM users
            WHERE username = %s
            LIMIT 1
            """,
            (username,)
        )
        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def create_user(
    name,
    email,
    password_hash=None,
    role="student",
    auth_provider="local",
    provider_id=None,
    username=None
):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO users (
                name,
                username,
                email,
                password_hash,
                role,
                auth_provider,
                provider_id
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                name,
                username,
                email,
                password_hash,
                role,
                auth_provider,
                provider_id
            )
        )

        connection.commit()
        return cursor.lastrowid

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()


def get_user_by_provider(auth_provider, provider_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT
                id,
                name,
                username,
                email,
                password_hash,
                role,
                auth_provider,
                provider_id
            FROM users
            WHERE auth_provider = %s
              AND provider_id = %s
            LIMIT 1
            """,
            (auth_provider, provider_id)
        )
        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def create_student_profile(user_id: int):
    connection = get_db_connection()

    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO student_profiles (user_id)
            VALUES (%s)
            """,
            (user_id,),
        )
        connection.commit()

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()