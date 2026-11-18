import json
import mysql.connector

from fastapi import APIRouter, HTTPException, status

from ai.common.date_utils import format_deadline
from database.connection import get_db_connection
from database.queries.scholarship_queries import (
    insert_scholarship_contacts,
    insert_scholarship_coverage,
    insert_scholarship_documents,
    insert_scholarship_eligibility,
    insert_scholarship_programs,
)
from database.schema.admin_scholarship_schemas import (
    AdminScholarshipCreate,
    AdminScholarshipUpdate,
)


router = APIRouter(
    prefix="/api/admin/scholarships",
    tags=["Admin - Scholarships"],
)


ROOT_FIELDS = {
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
RELATED_FIELDS = {
    "programs",
    "eligibility",
    "documents",
    "coverage",
    "contacts",
}


# ---------------------------------------------------------------------------
# Serialization and request helpers
# ---------------------------------------------------------------------------


def _model_data(value):
    """Return a dictionary for either a Pydantic model or a plain dictionary."""
    if hasattr(value, "model_dump"):
        return value.model_dump()
    return value


def _decode_json(value):
    if not isinstance(value, str):
        return value

    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return value


def _prepare_root_values(data):
    """Map API fields to database columns and normalize stored values."""
    values = {}

    for field, column in ROOT_FIELDS.items():
        if field not in data:
            continue

        value = data[field]

        # Keep the same deadline normalization used by the crawler.
        if field == "last_date_to_apply" and value:
            value = format_deadline(value)

        if field in JSON_FIELDS and value is not None:
            value = json.dumps(value, ensure_ascii=False)

        values[column] = value

    return values


def _serialize_scholarship(row):
    for field in JSON_FIELDS:
        row[field] = _decode_json(row.get(field)) or []

    if row.get("created_at"):
        row["created_at"] = row["created_at"].isoformat()

    if row.get("last_date_to_apply") is not None:
        row["last_date_to_apply"] = str(row["last_date_to_apply"])[:10]

    return row


def _get_program_names(cursor, scholarship_id):
    cursor.execute(
        """
        SELECT program_name
        FROM scholarship_programs
        WHERE scholarship_id = %s
        """,
        (scholarship_id,),
    )
    return {row[0] for row in cursor.fetchall()}


def _validate_related_data(cursor, scholarship_id, data):
    """Validate program references before writing related records."""
    if data.programs is None:
        program_names = _get_program_names(cursor, scholarship_id)
    else:
        program_names = {
            item.program if hasattr(item, "program") else item["program"]
            for item in data.programs
        }

    if data.eligibility is not None:
        eligibility = _model_data(data.eligibility)
        for group in eligibility.get("program_rules", []):
            if group["program"] not in program_names:
                raise HTTPException(
                    status_code=422,
                    detail=(
                        "Eligibility rules reference an unknown program: "
                        f"{group['program']}"
                    ),
                )

    if data.coverage is not None:
        for item in data.coverage:
            coverage_item = _model_data(item)
            program_name = coverage_item.get("program")
            if program_name and program_name not in program_names:
                raise HTTPException(
                    status_code=422,
                    detail=f"Coverage references an unknown program: {program_name}",
                )


def _save_related_data(scholarship_id, data):
    """Save only related sections supplied in the request.

    The existing insert helpers manage their own database connections and
    commits. They are intentionally reused here to preserve their established
    database mappings and eligibility-rule storage behavior.
    """
    if data.programs is not None:
        insert_scholarship_programs(
            scholarship_id,
            [_model_data(item) for item in data.programs],
        )

    if data.eligibility is not None:
        insert_scholarship_eligibility(
            scholarship_id,
            _model_data(data.eligibility),
        )

    if data.documents is not None:
        insert_scholarship_documents(
            scholarship_id,
            [_model_data(item) for item in data.documents],
        )

    if data.coverage is not None:
        insert_scholarship_coverage(
            scholarship_id,
            [_model_data(item) for item in data.coverage],
        )

    if data.contacts is not None:
        insert_scholarship_contacts(
            scholarship_id,
            [_model_data(item) for item in data.contacts],
        )


def _read_related_data(cursor, scholarship_id):
    """Read all admin-managed scholarship sections for the edit form."""
    cursor.execute(
        """
        SELECT
            id,
            program_name AS program,
            degree_level,
            duration,
            languages AS study_language
        FROM scholarship_programs
        WHERE scholarship_id = %s
        ORDER BY id
        """,
        (scholarship_id,),
    )
    programs = cursor.fetchall()

    for program in programs:
        program["degree_level"] = _decode_json(program.get("degree_level")) or []
        program["study_language"] = _decode_json(
            program.get("study_language")
        ) or []

    cursor.execute(
        """
        SELECT
            id,
            program_id,
            scope,
            rule_type,
            operator,
            rule_value,
            category,
            study_language,
            condition_json,
            source_sentence,
            mandatory
        FROM scholarship_eligibility
        WHERE scholarship_id = %s
        ORDER BY id
        """,
        (scholarship_id,),
    )
    stored_rules = cursor.fetchall()

    scholarship_rules = []
    program_rules = {}
    program_names_by_id = {
        program["id"]: program["program"] for program in programs
    }

    for rule in stored_rules:
        rule["condition"] = _decode_json(rule.pop("condition_json", None))
        rule["mandatory"] = bool(rule["mandatory"])

        if rule["scope"] == "scholarship" or not rule["program_id"]:
            scholarship_rules.append(rule)
            continue

        program_name = program_names_by_id.get(rule["program_id"])
        if program_name:
            program_rules.setdefault(program_name, []).append(rule)

    cursor.execute(
        """
        SELECT
            id,
            document_name,
            requirement,
            condition_text,
            mandatory,
            source_sentence
        FROM scholarship_documents
        WHERE scholarship_id = %s
        ORDER BY id
        """,
        (scholarship_id,),
    )
    documents = cursor.fetchall()
    for document in documents:
        document["mandatory"] = bool(document["mandatory"])

    cursor.execute(
        """
        SELECT
            coverage.id,
            coverage.program_id,
            programs.program_name AS program,
            coverage.benefit_type,
            coverage.description,
            coverage.amount,
            coverage.currency,
            coverage.period,
            coverage.coverage,
            coverage.applicability
        FROM scholarship_coverage AS coverage
        LEFT JOIN scholarship_programs AS programs
            ON programs.id = coverage.program_id
        WHERE coverage.scholarship_id = %s
        ORDER BY coverage.id
        """,
        (scholarship_id,),
    )
    coverage = cursor.fetchall()

    cursor.execute(
        """
        SELECT id, contact_type, value
        FROM scholarship_contacts
        WHERE scholarship_id = %s
        ORDER BY id
        """,
        (scholarship_id,),
    )
    contacts = cursor.fetchall()

    cursor.execute(
        """
        SELECT section_title, section_content
        FROM scholarship_sections
        WHERE scholarship_id = %s
        ORDER BY id
        """,
        (scholarship_id,),
    )
    sections = cursor.fetchall()

    return {
        "programs": programs,
        "eligibility": {
            "scholarship_rules": scholarship_rules,
            "program_rules": [
                {"program": name, "rules": rules}
                for name, rules in program_rules.items()
            ],
        },
        "documents": documents,
        "coverage": coverage,
        "contacts": contacts,
        "sections": sections,
    }


# ---------------------------------------------------------------------------
# List and retrieve scholarships
# ---------------------------------------------------------------------------


@router.get("/")
def list_admin_scholarships():
    connection = cursor = None

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
            ORDER BY created_at DESC, id DESC
            """
        )

        scholarships = [
            _serialize_scholarship(row) for row in cursor.fetchall()
        ]
        return {"success": True, "data": scholarships}

    except mysql.connector.Error as error:
        raise HTTPException(
            status_code=500,
            detail="Database error while listing scholarships.",
        ) from error

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


@router.get("/{scholarship_id}")
def get_scholarship_by_id(scholarship_id: int):
    connection = cursor = None

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

        _serialize_scholarship(scholarship)
        scholarship.update(_read_related_data(cursor, scholarship_id))

        return {"success": True, "data": scholarship}

    except HTTPException:
        raise
    except mysql.connector.Error as error:
        raise HTTPException(
            status_code=500,
            detail="Database error while retrieving scholarship.",
        ) from error

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


# ---------------------------------------------------------------------------
# Create scholarship
# ---------------------------------------------------------------------------


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_scholarship(data: AdminScholarshipCreate):
    connection = cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        values = _prepare_root_values(data.model_dump())
        columns = list(values)
        column_sql = ", ".join(f"`{column}`" for column in columns)
        placeholders = ", ".join(["%s"] * len(columns))

        cursor.execute(
            f"INSERT INTO scholarships ({column_sql}) VALUES ({placeholders})",
            tuple(values[column] for column in columns),
        )
        scholarship_id = cursor.lastrowid
        connection.commit()

        # Existing insert helpers open and commit their own connections.
        # Close this connection before calling them.
        cursor.close()
        cursor = None
        connection.close()
        connection = None

        _save_related_data(scholarship_id, data)

        return {
            "success": True,
            "message": "Scholarship created successfully.",
            "scholarship_id": scholarship_id,
        }

    except mysql.connector.IntegrityError as error:
        if connection and connection.is_connected():
            connection.rollback()

        if error.errno == 1062:
            raise HTTPException(
                status_code=409,
                detail="A scholarship with this title already exists.",
            ) from error

        raise HTTPException(
            status_code=500,
            detail="Database integrity error while creating scholarship.",
        ) from error

    except HTTPException:
        if connection and connection.is_connected():
            connection.rollback()
        raise

    except Exception as error:
        if connection and connection.is_connected():
            connection.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Scholarship creation failed: {error}",
        ) from error

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


# ---------------------------------------------------------------------------
# Update scholarship
# ---------------------------------------------------------------------------


@router.patch("/{scholarship_id}")
def update_scholarship(scholarship_id: int, data: AdminScholarshipUpdate):
    updates = data.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(
            status_code=400,
            detail="Provide at least one field to update.",
        )

    unsupported_fields = set(updates) - set(ROOT_FIELDS) - RELATED_FIELDS
    if unsupported_fields:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Unsupported field(s) in update request.",
                "fields": sorted(unsupported_fields),
            },
        )

    connection = cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "SELECT id FROM scholarships WHERE id = %s",
            (scholarship_id,),
        )
        if cursor.fetchone() is None:
            raise HTTPException(
                status_code=404,
                detail="Scholarship not found.",
            )

        _validate_related_data(cursor, scholarship_id, data)

        root_values = _prepare_root_values(
            {field: value for field, value in updates.items() if field in ROOT_FIELDS}
        )

        if root_values:
            assignments = ", ".join(
                f"`{column}` = %s" for column in root_values
            )
            cursor.execute(
                f"UPDATE scholarships SET {assignments} WHERE id = %s",
                (*root_values.values(), scholarship_id),
            )
            connection.commit()

        # The existing insert helpers perform upserts. For child sections that
        # are submitted as complete replacements, remove the old rows first.
        # Keep program rows themselves: their IDs may be referenced by rules
        # and coverage records, and the program helper updates them in place.
        replacement_tables = {
            "eligibility": "scholarship_eligibility",
            "documents": "scholarship_documents",
            "coverage": "scholarship_coverage",
            "contacts": "scholarship_contacts",
        }

        for field, table in replacement_tables.items():
            if field in updates:
                cursor.execute(
                    f"DELETE FROM {table} WHERE scholarship_id = %s",
                    (scholarship_id,),
                )

        if any(field in updates for field in replacement_tables):
            connection.commit()

        cursor.close()
        cursor = None
        connection.close()
        connection = None

        _save_related_data(scholarship_id, data)

        return {
            "success": True,
            "message": "Scholarship updated successfully.",
            "scholarship_id": scholarship_id,
            "updated_fields": sorted(updates),
        }

    except mysql.connector.IntegrityError as error:
        if connection and connection.is_connected():
            connection.rollback()

        if error.errno == 1062:
            raise HTTPException(
                status_code=409,
                detail="A scholarship with this title already exists.",
            ) from error

        raise HTTPException(
            status_code=500,
            detail="Database integrity error while updating scholarship.",
        ) from error

    except HTTPException:
        if connection and connection.is_connected():
            connection.rollback()
        raise

    except Exception as error:
        if connection and connection.is_connected():
            connection.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Scholarship update failed: {error}",
        ) from error

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


# ---------------------------------------------------------------------------
# Delete scholarship
# ---------------------------------------------------------------------------


@router.delete("/{scholarship_id}")
def delete_scholarship(scholarship_id: int):
    connection = cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "SELECT id FROM scholarships WHERE id = %s",
            (scholarship_id,),
        )

        if cursor.fetchone() is None:
            raise HTTPException(
                status_code=404,
                detail="Scholarship not found.",
            )

        # Delete dependent records before deleting program and root records.
        child_tables = (
            "scholarship_eligibility",
            "scholarship_documents",
            "scholarship_coverage",
            "scholarship_contacts",
            "scholarship_sections",
            "scholarship_programs",
        )

        for table in child_tables:
            cursor.execute(
                f"DELETE FROM {table} WHERE scholarship_id = %s",
                (scholarship_id,),
            )

        cursor.execute(
            "DELETE FROM scholarships WHERE id = %s",
            (scholarship_id,),
        )
        connection.commit()

        return {
            "success": True,
            "message": "Scholarship and related records deleted successfully.",
        }

    except HTTPException:
        if connection and connection.is_connected():
            connection.rollback()
        raise

    except mysql.connector.Error as error:
        if connection and connection.is_connected():
            connection.rollback()
        raise HTTPException(
            status_code=500,
            detail="Database error while deleting scholarship.",
        ) from error

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
