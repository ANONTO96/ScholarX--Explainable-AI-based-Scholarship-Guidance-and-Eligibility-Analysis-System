
import mysql.connector

from fastapi import APIRouter, HTTPException, status

from database.connection import get_db_connection
from database.schema.scholarship_schemas import (
    ScholarshipCreate,
    ScholarshipUpdate,
)
from database.queries.scholarship_queries import (
    insert_china_full_scholarship,
)


router = APIRouter(
    prefix="/api/admin/scholarships",
    tags=["Admin - Scholarships"],
)


# CREATE SCHOLARSHIP
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_scholarship(data: ScholarshipCreate):
    final_data = {
        "scholarship_title": data.scholarship_title.strip(),
        "country": data.country,
        "last_date_to_apply": data.last_date_to_apply,
        "official_website": data.official_website,
        "bd_ambassy_website": data.bd_ambassy_website,
        "sections": [
            section.model_dump()
            for section in data.sections
        ],
    }

    result = insert_china_full_scholarship(final_data)

    if result.get("status") == 409:
        raise HTTPException(
            status_code=409,
            detail=result.get(
                "error", "Scholarship already exists."
            ),
        )

    if result.get("status") != 201:
        raise HTTPException(
            status_code=500,
            detail="Failed to save scholarship to the database.",
        )

    return {
        "success": True,
        "message": "Scholarship created successfully.",
        "scholarship_id": result["scholarship_id"],
    }


# UPDATE SCHOLARSHIP
@router.patch("/{scholarship_id}")
def update_scholarship(
    scholarship_id: int,
    data: ScholarshipUpdate,
):
    allowed_fields = {
        "scholarship_title": "title",
        "country": "country",
        "last_date_to_apply": "last_date_to_apply",
        "official_website": "official_website",
        "bd_ambassy_website": "bd_ambassy_website",
    }

    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="Provide at least one field to update.",
        )

    if "scholarship_title" in updates:
        title = updates["scholarship_title"]

        if title is None or not title.strip():
            raise HTTPException(
                status_code=422,
                detail="Scholarship title cannot be empty.",
            )

        updates["scholarship_title"] = title.strip()

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

        set_clause = ", ".join(
            f"`{allowed_fields[field]}` = %s"
            for field in updates
        )

        values = list(updates.values()) + [scholarship_id]

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
                    created_at
                FROM scholarships
                WHERE id = %s
            """,
            (scholarship_id,),
        )

        scholarship = cursor.fetchone()

        if scholarship and scholarship.get("created_at"):
            scholarship["created_at"] = (
                scholarship["created_at"].isoformat()
            )

        return {
            "success": True,
            "message": "Scholarship updated successfully.",
            "data": scholarship,
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
            detail="Failed to update scholarship.",
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
