from database.connection import get_db_connection


def get_user_by_email(email):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT id, name, email, password_hash, role
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


def create_user(
    name,
    email,
    password_hash=None,
    role="student",
    auth_provider="local",
    provider_id=None
):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO users
                (
                    name,
                    email,
                    password_hash,
                    role,
                    auth_provider,
                    provider_id
                )
            VALUES
                (%s, %s, %s, %s, %s, %s)
        """, (
            name,
            email,
            password_hash,
            role,
            auth_provider,
            provider_id
        ))

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
        cursor.execute("""
            SELECT
                id,
                name,
                email,
                password_hash,
                role,
                auth_provider,
                provider_id
            FROM users
            WHERE auth_provider = %s
              AND provider_id = %s
            LIMIT 1
        """, (auth_provider, provider_id))

        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()