import os
import smtplib
from datetime import datetime
from email.message import EmailMessage
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field, validator

from database.connection import get_db_connection
from api.auth.dependencies import get_current_user

router = APIRouter(tags=["Notifications"])


class CreateNotificationRequest(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    message: str = Field(min_length=1, max_length=2000)
    audience: Literal["all_students", "active_students"]
    channels: list[Literal["in_app", "email"]] = Field(...)

    @validator("title", "message")
    def strip_text(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank.")
        return value

    @validator("channels")
    def unique_channels(cls, value):
        if not value:
            raise ValueError("Select at least one delivery channel.")
        if len(value) != len(set(value)):
            raise ValueError("Duplicate delivery channels are not allowed.")
        return value


def _get_user_role(user_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT id, name, email, role, is_active FROM users WHERE id = %s LIMIT 1",
            (user_id,),
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        connection.close()


def require_admin(current_user=Depends(get_current_user)):
    user = _get_user_role(int(current_user["user_id"]))
    if not user or user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    return user


def require_student(current_user=Depends(get_current_user)):
    user = _get_user_role(int(current_user["user_id"]))
    if not user or user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student access required.")
    if not user.get("is_active"):
        raise HTTPException(status_code=403, detail="This student account is inactive.")
    return user

def require_notification_user(current_user=Depends(get_current_user)):
    user = _get_user_role(int(current_user["user_id"]))

    if not user or user["role"] not in ("admin", "student"):
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to view notifications.",
        )

    if not user.get("is_active"):
        raise HTTPException(
            status_code=403,
            detail="Your account is inactive.",
        )

    return user

def _smtp_settings():
    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
    sender = os.getenv("SMTP_FROM_EMAIL") or username
    if not all([host, username, password, sender]):
        return None
    return {
        "host": host,
        "port": int(os.getenv("SMTP_PORT", "587")),
        "username": username,
        "password": password,
        "sender": sender,
        "use_tls": os.getenv("SMTP_USE_TLS", "true").lower() in ("1", "true", "yes"),
        "use_ssl": os.getenv("SMTP_USE_SSL", "false").lower() in ("1", "true", "yes"),
    }


def _send_email(recipient: str, title: str, body: str):
    settings = _smtp_settings()
    if not settings:
        raise RuntimeError("SMTP is not configured. Set SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD and SMTP_FROM_EMAIL.")

    email = EmailMessage()
    email["Subject"] = title
    email["From"] = settings["sender"]
    email["To"] = recipient
    email.set_content(body)

    if settings["use_ssl"]:
        with smtplib.SMTP_SSL(settings["host"], settings["port"], timeout=20) as server:
            server.login(settings["username"], settings["password"])
            server.send_message(email)
    else:
        with smtplib.SMTP(settings["host"], settings["port"], timeout=20) as server:
            server.ehlo()
            if settings["use_tls"]:
                server.starttls()
                server.ehlo()
            server.login(settings["username"], settings["password"])
            server.send_message(email)


@router.post("/api/admin/notifications", status_code=status.HTTP_201_CREATED)
def create_notification(
    payload: CreateNotificationRequest,
    admin=Depends(require_admin),
):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        if payload.audience == "active_students":
            cursor.execute(
                "SELECT id, name, email FROM users WHERE role = 'student' AND is_active = 1 ORDER BY id"
            )
        else:
            cursor.execute(
                "SELECT id, name, email FROM users WHERE role = 'student' ORDER BY id"
            )
        recipients = cursor.fetchall()
        if not recipients:
            raise HTTPException(status_code=400, detail="No student recipients were found.")

        channels_text = ",".join(payload.channels)
        cursor.execute(
            """INSERT INTO notifications (title, message, audience, channels, created_by)
               VALUES (%s, %s, %s, %s, %s)""",
            (payload.title, payload.message, payload.audience, channels_text, admin["id"]),
        )
        notification_id = cursor.lastrowid

        if "in_app" in payload.channels:
            cursor.executemany(
                "INSERT INTO user_notifications (notification_id, user_id) VALUES (%s, %s)",
                [(notification_id, student["id"]) for student in recipients],
            )

        if "email" in payload.channels:
            cursor.executemany(
                """INSERT INTO notification_deliveries
                   (notification_id, user_id, channel, status)
                   VALUES (%s, %s, 'email', 'pending')""",
                [(notification_id, student["id"]) for student in recipients],
            )

        connection.commit()
    except HTTPException:
        connection.rollback()
        raise
    except Exception as exc:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Could not create notification: {str(exc)}")
    finally:
        cursor.close()
        connection.close()

    email_result = {"sent": 0, "failed": 0}
    if "email" in payload.channels:
        for student in recipients:
            delivery_status = "sent"
            error_message = None
            try:
                if not student.get("email"):
                    raise RuntimeError("Student has no email address.")
                _send_email(student["email"], payload.title, payload.message)
                email_result["sent"] += 1
            except Exception as exc:
                delivery_status = "failed"
                error_message = str(exc)[:1000]
                email_result["failed"] += 1

            update_connection = get_db_connection()
            update_cursor = update_connection.cursor()
            try:
                update_cursor.execute(
                    """UPDATE notification_deliveries
                       SET status = %s, error_message = %s, attempted_at = %s
                       WHERE notification_id = %s AND user_id = %s AND channel = 'email'""",
                    (delivery_status, error_message, datetime.now(), notification_id, student["id"]),
                )
                update_connection.commit()
            finally:
                update_cursor.close()
                update_connection.close()

    return {
        "success": True,
        "message": "Notification created.",
        "notification_id": notification_id,
        "recipient_count": len(recipients),
        "in_app_created": len(recipients) if "in_app" in payload.channels else 0,
        "email": email_result if "email" in payload.channels else None,
    }


@router.get("/api/admin/notifications")
def admin_notification_history(
    limit: int = Query(default=30, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    admin=Depends(require_admin),
):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            """SELECT n.id, n.title, n.message, n.audience, n.channels, n.created_at,
                      COALESCE(uc.in_app_recipients, 0) AS in_app_recipients,
                      COALESCE(ec.emails_sent, 0) AS emails_sent,
                      COALESCE(ec.emails_failed, 0) AS emails_failed
               FROM notifications n
               LEFT JOIN (
                   SELECT notification_id, COUNT(*) AS in_app_recipients
                   FROM user_notifications GROUP BY notification_id
               ) uc ON uc.notification_id = n.id
               LEFT JOIN (
                   SELECT notification_id,
                          SUM(status = 'sent') AS emails_sent,
                          SUM(status = 'failed') AS emails_failed
                   FROM notification_deliveries WHERE channel = 'email'
                   GROUP BY notification_id
               ) ec ON ec.notification_id = n.id
               WHERE n.created_by = %s
               ORDER BY n.created_at DESC
               LIMIT %s OFFSET %s""",
            (admin["id"], limit, offset),
        )
        rows = cursor.fetchall()
        return {"items": rows, "limit": limit, "offset": offset}
    finally:
        cursor.close()
        connection.close()

@router.get("/api/notifications")
def get_my_notifications(
    limit: int = Query(default=30, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    user=Depends(require_notification_user),
):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """SELECT un.id AS user_notification_id,
       n.id AS notification_id,
       n.title,
       n.message,
       n.type,
       n.link,
       un.is_read,
       un.read_at,
       un.delivered_at
               FROM user_notifications un
               JOIN notifications n ON n.id = un.notification_id
               WHERE un.user_id = %s
               ORDER BY un.delivered_at DESC
               LIMIT %s OFFSET %s""",
            (user["id"], limit, offset),
        )

        items = cursor.fetchall()
        return {"items": items, "limit": limit, "offset": offset}

    finally:
        cursor.close()
        connection.close()


@router.get("/api/notifications/unread-count")
def unread_notification_count(user=Depends(require_notification_user)):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT COUNT(*) AS unread_count FROM user_notifications WHERE user_id = %s AND is_read = 0",
            (user["id"],),
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        connection.close()


@router.patch("/api/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    user=Depends(require_notification_user),
):         
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            """UPDATE user_notifications
               SET is_read = 1, read_at = COALESCE(read_at, NOW())
               WHERE notification_id = %s AND user_id = %s""",
            (notification_id, user["id"]),
        )
        if cursor.rowcount == 0:
            connection.rollback()
            raise HTTPException(status_code=404, detail="Notification not found for this user.")
        connection.commit()
        return {"success": True, "message": "Notification marked as read."}
    finally:
        cursor.close()
        connection.close()


@router.patch("/api/notifications/read-all")
def mark_all_notifications_read(user=Depends(require_notification_user)):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            """UPDATE user_notifications
               SET is_read = 1, read_at = NOW()
               WHERE user_id = %s AND is_read = 0""",
            (user["id"],),
        )
        updated = cursor.rowcount
        connection.commit()
        return {"success": True, "updated_count": updated}
    finally:
        cursor.close()
        connection.close()
