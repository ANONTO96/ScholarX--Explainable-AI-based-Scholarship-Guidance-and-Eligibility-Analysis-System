from database.connection import get_db_connection


def create_profile_completion_notification(user_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()

    unique_key = f"profile_completion:{user_id}"

    title = "Complete Your Profile"

    message = (
        "Welcome to ScholarX! Your profile is not fully completed yet. "
        "Please provide your academic background, English language "
        "qualifications, and study preferences to get more accurate "
        "scholarship eligibility analysis and personalized recommendations."
    )

    try:
        cursor.execute(
            """
            INSERT INTO notifications (
                title,
                message,
                audience,
                channels,
                created_by,
                type,
                link,
                unique_key
            )
            VALUES (%s, %s, 'system', 'in_app', NULL, 'profile', %s, %s)
            ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
            """,
            (
                title,
                message,
                "/dashboard/profile",
                unique_key,
            ),
        )

        notification_id = cursor.lastrowid

        cursor.execute(
            """
            INSERT IGNORE INTO user_notifications (
                notification_id,
                user_id
            )
            VALUES (%s, %s)
            """,
            (notification_id, user_id),
        )

        connection.commit()

        return notification_id

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()