
from fastapi import APIRouter, HTTPException, Query
from database.connection import get_db_connection

router = APIRouter(
    prefix="/api/scholarships",
    tags=["Scholarships"],
)


@router.get("/")
def get_scholarships(
    country: str | None = Query(default=None),
):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                id,
                title,
                country,
                last_date_to_apply,
                official_website,
                bd_ambassy_website,
                created_at
            FROM scholarships
        """

        params = ()

        if country:
            query += " WHERE country = %s"
            params = (country.strip(),)

        query += " ORDER BY id DESC"

        cursor.execute(query, params)
        scholarships = cursor.fetchall()

        for scholarship in scholarships:
            created_at = scholarship.get("created_at")
            if created_at is not None:
                scholarship["created_at"] = created_at.isoformat()

        return {
            "success": True,
            "count": len(scholarships),
            "data": scholarships,
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve scholarships.",
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()
