
from datetime import date, datetime
from decimal import Decimal

from fastapi import APIRouter, HTTPException, Query

from database.connection import get_db_connection


router = APIRouter(
    prefix="/api/scholarships",
    tags=["Scholarships"],
)


def make_json_safe(value):
    """Convert database values into JSON-serializable values."""
    if isinstance(value, (datetime, date)):
        return value.isoformat()

    if isinstance(value, Decimal):
        return float(value)

    if isinstance(value, dict):
        return {
            key: make_json_safe(item)
            for key, item in value.items()
        }

    if isinstance(value, list):
        return [
            make_json_safe(item)
            for item in value
        ]

    return value


@router.get("/")
def get_scholarships(
    country: str | None = Query(default=None),
):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # 1. Retrieve scholarships
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

        if country and country.strip():
            query += " WHERE country = %s"
            params = (country.strip(),)

        query += " ORDER BY id DESC"

        cursor.execute(query, params)
        scholarships = cursor.fetchall()

        # 2. Retrieve related information for each scholarship
        for scholarship in scholarships:
            scholarship_id = scholarship["id"]

            # Programs
            cursor.execute(
                """
                SELECT
                    id,
                    scholarship_id,
                    program_name,
                    degree_level,
                    duration,
                    languages
                FROM scholarship_programs
                WHERE scholarship_id = %s
                ORDER BY id ASC
                """,
                (scholarship_id,),
            )

            programs = cursor.fetchall()

            # Coverage / benefits
            cursor.execute(
                """
                SELECT
                    id,
                    scholarship_id,
                    program_id,
                    benefit_type,
                    description,
                    amount,
                    currency,
                    period,
                    coverage,
                    applicability
                FROM scholarship_coverage
                WHERE scholarship_id = %s
                ORDER BY id ASC
                """,
                (scholarship_id,),
            )

            coverage_records = cursor.fetchall()

            # Group coverage by program_id.
            # Coverage with program_id = NULL stays at scholarship level.
            program_coverage = {}

            for program in programs:
                program["coverage"] = []
                program_coverage[program["id"]] = program["coverage"]

            scholarship_coverage = []

            for benefit in coverage_records:
                program_id = benefit.get("program_id")

                if (
                    program_id is not None
                    and program_id in program_coverage
                ):
                    program_coverage[program_id].append(benefit)
                else:
                    scholarship_coverage.append(benefit)

            # IMPORTANT:
            # Do not add a documents array to individual programs.
            # Each program contains only its own coverage.

            scholarship["programs"] = programs
            scholarship["coverage"] = scholarship_coverage

            # Documents: keep them only at scholarship level
            cursor.execute(
                """
                SELECT
                    id,
                    scholarship_id,
                    document_name,
                    requirement,
                    condition_text,
                    mandatory,
                    source_sentence
                FROM scholarship_documents
                WHERE scholarship_id = %s
                ORDER BY id ASC
                """,
                (scholarship_id,),
            )

            scholarship["documents"] = cursor.fetchall()

            # Contacts
            cursor.execute(
                """
                SELECT
                    id,
                    scholarship_id,
                    contact_type,
                    value
                FROM scholarship_contacts
                WHERE scholarship_id = %s
                ORDER BY id ASC
                """,
                (scholarship_id,),
            )

            scholarship["contacts"] = cursor.fetchall()

        return make_json_safe({
            "success": True,
            "count": len(scholarships),
            "data": scholarships,
        })

    except Exception as exc:
        print(f"Failed to retrieve scholarships: {exc}")

        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve scholarships.",
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()
