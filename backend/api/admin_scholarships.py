
import json
import mysql.connector

from fastapi import APIRouter, HTTPException, status

from database.connection import get_db_connection
from database.schema.admin_scholarship_schemas import (
    AdminScholarshipCreate,
    AdminScholarshipUpdate,
)
from database.queries.scholarship_queries import (
    insert_scholarship_programs,
    insert_scholarship_eligibility,
    insert_scholarship_documents,
    insert_scholarship_coverage,
    insert_scholarship_contacts,
     get_sections_by_scholarship_id,
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


def prepare_values(data):
    values = {}

    for field, column in ALLOWED_FIELDS.items():
        if field not in data:
            continue

        value = data[field]

        if field == "last_date_to_apply" and value:
            value = format_deadline(value)

        if field in JSON_FIELDS and value is not None:
            value = json.dumps(value)

        values[column] = value
    return values


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


# GET SCHOLARSHIP BY ID
@router.get("/{scholarship_id}")
def get_scholarship_by_id(scholarship_id: int):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

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

        if scholarship is None:
            raise HTTPException(
                status_code=404,
                detail="Scholarship not found.",
            )

        # Convert the main scholarship record into JSON-compatible values.
        scholarship = serialize_scholarship(scholarship)

        if scholarship.get("last_date_to_apply"):
            scholarship["last_date_to_apply"] = str(
                scholarship["last_date_to_apply"]
            )[:10]

        # Fetch sections using the existing project query helper.
        sections = get_sections_by_scholarship_id(scholarship_id)

        # These arrays are placeholders until the corresponding
        # existing read/query helpers are connected.
        scholarship["sections"] = sections or []
        scholarship["programs"] = []
        scholarship["documents"] = []
        scholarship["coverage"] = []
        scholarship["contacts"] = []

        return {
            "success": True,
            "data": scholarship,
        }

    except HTTPException:
        raise

    except mysql.connector.Error as err:
        print(
            f"Failed to retrieve scholarship "
            f"id={scholarship_id}: {err}"
        )

        raise HTTPException(
            status_code=500,
            detail="Database error while retrieving scholarship.",
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()

# ============================================================
# CREATE SCHOLARSHIP
# ============================================================

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_scholarship(data: AdminScholarshipCreate):

    connection = None
    cursor = None

    try:
        # ----------------------------------------------------
        # 1. Prepare main scholarship information
        # ----------------------------------------------------

        scholarship_data = {
            "scholarship_title": data.scholarship_title,
            "country": data.country,
            "last_date_to_apply": data.last_date_to_apply,
            "official_website": data.official_website,
            "bd_ambassy_website": data.bd_ambassy_website,
            "scholarship_type": data.scholarship_type,
            "cities": data.cities,
            "keywords": data.keywords,
        }

        values = prepare_values(scholarship_data)

        # prepare_values() already converts API field names
        # into database column names.
        column_names = list(values.keys())

        placeholders = ", ".join(
            ["%s"] * len(column_names)
        )

        sql_columns = ", ".join(
            f"`{column}`" for column in column_names
        )

        # ----------------------------------------------------
        # 2. Insert main scholarship
        # ----------------------------------------------------

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            f"""
                INSERT INTO scholarships ({sql_columns})
                VALUES ({placeholders})
            """,
            tuple(values[column] for column in column_names),
        )

        scholarship_id = cursor.lastrowid

        connection.commit()

        cursor.close()
        cursor = None

        connection.close()
        connection = None

        # ----------------------------------------------------
        # 3. Prepare related data
        # ----------------------------------------------------

        programs = [
            item.model_dump()
            for item in data.programs
        ]

        eligibility = data.eligibility.model_dump()

        documents = [
            item.model_dump()
            for item in data.documents
        ]

        coverage = [
            item.model_dump()
            for item in data.coverage
        ]

        contacts = [
            item.model_dump()
            for item in data.contacts
        ]

        # ----------------------------------------------------
        # 4. Validate program references
        # ----------------------------------------------------

        program_names = {
            program["program"]
            for program in programs
        }

        for program_rule in eligibility.get("program_rules", []):
            if program_rule["program"] not in program_names:
                raise ValueError(
                    f"Eligibility rules reference an unknown program: "
                    f"{program_rule['program']}"
                )

        for item in coverage:
            program_name = item.get("program")

            if program_name and program_name not in program_names:
                raise ValueError(
                    f"Coverage references an unknown program: "
                    f"{program_name}"
                )

        # ----------------------------------------------------
        # 5. Insert scholarship programs
        # ----------------------------------------------------

        program_result = insert_scholarship_programs(
            scholarship_id,
            programs,
        )

        # ----------------------------------------------------
        # 6. Insert scholarship eligibility rules
        # ----------------------------------------------------

        eligibility_result = insert_scholarship_eligibility(
            scholarship_id,
            eligibility,
        )

        # ----------------------------------------------------
        # 7. Insert required documents
        # ----------------------------------------------------

        document_result = insert_scholarship_documents(
            scholarship_id,
            documents,
        )

        # ----------------------------------------------------
        # 8. Insert scholarship coverage
        # ----------------------------------------------------

        coverage_result = insert_scholarship_coverage(
            scholarship_id,
            coverage,
        )

        # ----------------------------------------------------
        # 9. Insert scholarship contacts
        # ----------------------------------------------------

        contact_result = insert_scholarship_contacts(
            scholarship_id,
            contacts,
        )

        # ----------------------------------------------------
        # 10. Return result
        # ----------------------------------------------------

        return {
            "success": True,
            "message": "Scholarship and all related information created successfully.",
            "scholarship_id": scholarship_id,
            "inserted_data": {
                "programs": program_result,
                "eligibility": eligibility_result,
                "documents": document_result,
                "coverage": coverage_result,
                "contacts": contact_result,
            },
        }

    except HTTPException:
        raise

    except mysql.connector.IntegrityError as err:

        if connection is not None and connection.is_connected():
            connection.rollback()

        if err.errno == 1062:
            raise HTTPException(
                status_code=409,
                detail="A scholarship with this title already exists.",
            )

        print(f"Scholarship insertion error: {err}")

        raise HTTPException(
            status_code=500,
            detail="Database integrity error while creating scholarship.",
        )

    except Exception as err:

        if connection is not None and connection.is_connected():
            connection.rollback()

        print(
            f"Scholarship creation failed: {err}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(err),
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
    data: AdminScholarshipUpdate,
):
    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="Provide at least one field to update.",
        )

    # Separate main-table fields from related-table fields.
    related_fields = {
        "programs",
        "eligibility",
        "documents",
        "coverage",
        "contacts",
    }
    root_updates = {
        field: value
        for field, value in updates.items()
        if field in ALLOWED_FIELDS
    }

    unsupported_fields = (
        set(updates) - set(ALLOWED_FIELDS) - related_fields
    )

    if unsupported_fields:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Unsupported field(s) in update request.",
                "fields": sorted(unsupported_fields),
            },
        )

    # Validate and normalize only main-table fields.
    root_updates = prepare_values(root_updates)

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

        # Update the main scholarships table only when needed.
        if root_updates:
            set_clause = ", ".join(
                f"`{ALLOWED_FIELDS[field]}` = %s"
                for field in root_updates
            )

            cursor.execute(
                f"""
                    UPDATE scholarships
                    SET {set_clause}
                    WHERE id = %s
                """,
                list(root_updates.values()) + [scholarship_id],
            )

            connection.commit()

    except HTTPException:
        if connection is not None and connection.is_connected():
            connection.rollback()
        raise

    except mysql.connector.Error:
        if connection is not None and connection.is_connected():
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Database error while updating scholarship fields.",
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()

    # Update related tables only when the field was submitted.
    # Omitted fields remain untouched.
    try:
        if "programs" in updates:
            insert_scholarship_programs(
                scholarship_id,
                [
                    item.model_dump()
                    if hasattr(item, "model_dump")
                    else item
                    for item in data.programs
                ],
            )

        if "eligibility" in updates:
            insert_scholarship_eligibility(
                    scholarship_id,
                    data.eligibility.model_dump(),
                )

        if "documents" in updates:
            insert_scholarship_documents(
                scholarship_id,
                [
                    item.model_dump()
                    if hasattr(item, "model_dump")
                    else item
                    for item in data.documents
                ],
            )

        if "coverage" in updates:
            insert_scholarship_coverage(
                scholarship_id,
                [
                    item.model_dump()
                    if hasattr(item, "model_dump")
                    else item
                    for item in data.coverage
                ],
            )

        if "contacts" in updates:
            insert_scholarship_contacts(
                scholarship_id,
                [
                    item.model_dump()
                    if hasattr(item, "model_dump")
                    else item
                    for item in data.contacts
                ],
            )

    except Exception as err:
        # Related-table helpers may use their own connections.
        # Their commits cannot be rolled back by the connection above.
        print(
            f"Related scholarship update failed for "
            f"scholarship_id={scholarship_id}: {err}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "The main scholarship fields may already have been saved, "
                "but a related-table update failed. Check backend logs."
            ),
        )

    return {
        "success": True,
        "message": "Scholarship update processed successfully.",
        "scholarship_id": scholarship_id,
        "updated_fields": sorted(updates.keys()),
    }
