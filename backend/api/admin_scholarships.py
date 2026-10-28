
import json
import mysql.connector

from fastapi import APIRouter, HTTPException, status

from database.connection import get_db_connection
from database.schema.scholarship_schemas import (
    ScholarshipCreate,
    ScholarshipUpdate,
)
from ai.common.date_utils import format_deadline


router = APIRouter(
    prefix="/api/admin/scholarships",
    tags=["Admin - Scholarships"],
)


# Fields that can be managed through this API.
ALLOWED_FIELDS = {
    "scholarship_title": "title",
    "country": "country",
    "last_date_to_apply": "last_date_to_apply",
    "official_website": "official_website",
    "bd_ambassy_website": "bd_ambassy_website",
    "scholarship_type": "scholarship_type",
    "cities": "cities",
    "keywords": "keywords",
}

JSON_FIELDS = {"cities", "keywords"}


def prepare_values(data: dict) -> dict:
    """Normalize values before inserting or updating MySQL."""

    if "scholarship_title" in data:
        title = data["scholarship_title"]

        if title is None or not title.strip():
            raise HTTPException(
                status_code=422,
                detail="Scholarship title cannot be empty.",
            )

        data["scholarship_title"] = title.strip()

    if "last_date_to_apply" in data:
        try:
            data["last_date_to_apply"] = format_deadline(
                data["last_date_to_apply"]
            )
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=422,
                detail=(
                    "Invalid deadline format. "
                    "Use a recognizable date, such as January 10, 2027."
                ),
            )

    for field in JSON_FIELDS:
        if field in data and data[field] is not None:
            data[field] = json.dumps(
                data[field],
                ensure_ascii=False,
            )

    return data


def serialize_scholarship(scholarship: dict) -> dict:
    """Convert database values into JSON-compatible values."""

    if scholarship.get("created_at"):
        scholarship["created_at"] = (
            scholarship["created_at"].isoformat()
        )

    for field in JSON_FIELDS:
        value = scholarship.get(field)

        if isinstance(value, str):
            try:
                scholarship[field] = json.loads(value)
            except json.JSONDecodeError:
                pass

    return scholarship


# CREATE SCHOLARSHIP
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_scholarship(data: ScholarshipCreate):
    values = {
    "scholarship_title": data.scholarship_title,
    "country": data.country,
    "last_date_to_apply": data.last_date_to_apply,
    "official_website": data.official_website,
    "bd_ambassy_website": data.bd_ambassy_website,
    "scholarship_type": data.scholarship_type,
    "cities": data.cities,
    "keywords": data.keywords,
    }

    values = prepare_values(values)

    columns = {
        "scholarship_title": "title",
        "country": "country",
        "last_date_to_apply": "last_date_to_apply",
        "official_website": "official_website",
        "bd_ambassy_website": "bd_ambassy_website",
        "scholarship_type": "scholarship_type",
        "cities": "cities",
        "keywords": "keywords",
    }

    column_names = [columns[field] for field in values]
    placeholders = ", ".join(["%s"] * len(column_names))
    sql_columns = ", ".join(f"`{name}`" for name in column_names)

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            f"""
                INSERT INTO scholarships ({sql_columns})
                VALUES ({placeholders})
            """,
            tuple(values[field] for field in values),
        )

        scholarship_id = cursor.lastrowid
        connection.commit()

        return {
            "success": True,
            "message": "Scholarship created successfully.",
            "scholarship_id": scholarship_id,
        }

    except HTTPException:
        if connection is not None and connection.is_connected():
            connection.rollback()
        raise

    except mysql.connector.IntegrityError as err:
        if connection is not None and connection.is_connected():
            connection.rollback()

        if err.errno == 1062:
            raise HTTPException(
                status_code=409,
                detail="A scholarship with this title already exists.",
            )

        raise HTTPException(
            status_code=500,
            detail="Database integrity error while creating scholarship.",
        )

    except mysql.connector.Error:
        if connection is not None and connection.is_connected():
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Database error while creating scholarship.",
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()


# UPDATE SCHOLARSHIP
@router.patch("/{scholarship_id}")
def update_scholarship(
    scholarship_id: int,
    data: ScholarshipUpdate,
):
    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="Provide at least one field to update.",
        )

    unknown_fields = set(updates) - set(ALLOWED_FIELDS)

    if unknown_fields:
        raise HTTPException(
            status_code=422,
            detail="Unsupported field(s) in update request.",
        )

    updates = prepare_values(updates)

    set_clause = ", ".join(
        f"`{ALLOWED_FIELDS[field]}` = %s"
        for field in updates
    )

    values = list(updates.values()) + [scholarship_id]

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT id FROM scholarships WHERE id = %s",
            (scholarship_id,),
        )

        if cursor.fetchone() is None:
            raise HTTPException(
                status_code=404,
                detail="Scholarship not found.",
            )

        cursor.execute(
            f"""
                UPDATE scholarships
                SET {set_clause}
                WHERE id = %s
            """,
            values,
        )

        connection.commit()

        cursor.execute(
            """
                SELECT
                    id,
                    title,
                    country,
                    last_date_to_apply,
                    official_website,
                    bd_ambassy_website,
                    scholarship_type,
                    cities,
                    keywords,
                    created_at
                FROM scholarships
                WHERE id = %s
            """,
            (scholarship_id,),
        )

        scholarship = cursor.fetchone()

        return {
            "success": True,
            "message": "Scholarship updated successfully.",
            "data": serialize_scholarship(scholarship),
        }

    except HTTPException:
        if connection is not None and connection.is_connected():
            connection.rollback()
        raise

    except mysql.connector.IntegrityError as err:
        if connection is not None and connection.is_connected():
            connection.rollback()

        if err.errno == 1062:
            raise HTTPException(
                status_code=409,
                detail="A scholarship with this title already exists.",
            )

        raise HTTPException(
            status_code=500,
            detail="Database integrity error while updating scholarship.",
        )

    except mysql.connector.Error:
        if connection is not None and connection.is_connected():
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Database error while updating scholarship.",
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()
