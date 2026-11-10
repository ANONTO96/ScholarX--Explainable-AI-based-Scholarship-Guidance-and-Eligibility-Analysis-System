import json
from datetime import date, datetime
from decimal import Decimal
from typing import Any

from services.age_service import calculate_age


def _normalize_value(value: Any) -> Any:
    """Convert database values into JSON-friendly Python values."""

    if isinstance(value, Decimal):
        return str(value)

    if isinstance(value, (date, datetime)):
        return value.isoformat()

    if isinstance(value, (bytes, bytearray)):
        return value.decode("utf-8")

    return value


def _normalize_row(row: dict | None) -> dict | None:
    """Normalize all values in a database row."""

    if row is None:
        return None

    return {
        key: _normalize_value(value)
        for key, value in row.items()
    }


def _decode_json(value: Any) -> Any:
    """
    Decode JSON stored in LONGTEXT columns.

    Invalid JSON is preserved as its original value.
    """

    if value is None or value == "":
        return None

    if isinstance(value, (dict, list, int, float, bool)):
        return value

    if isinstance(value, (bytes, bytearray)):
        value = value.decode("utf-8")

    if not isinstance(value, str):
        return value

    try:
        return json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return value


def _normalize_profile(profile: dict | None) -> dict | None:
    """Normalize the main profile and its JSON fields."""

    if profile is None:
        return None

    profile = _normalize_row(profile)

    json_fields = [
        "achievements",
        "innovation_projects",
        "partner_universities",
        "additional_information",
    ]

    for field in json_fields:
        profile[field] = _decode_json(profile.get(field))

    # None = unknown, False = explicitly false, True = true.
    boolean_fields = [
        "leadership_experience",
        "community_service",
        "research_experience",
        "international_student",
        "currently_enrolled",
        "gdsc_member",
        "university_team_member",
    ]

    for field in boolean_fields:
        value = profile.get(field)
        profile[field] = None if value is None else bool(value)

    return profile


# =========================================================
# DATABASE LOADERS
# =========================================================

def _load_profile(cursor, user_id: int) -> dict | None:

    cursor.execute(
        """
        SELECT
            user_id,
            nationality,
            date_of_birth,
            current_study_level,
            field_of_study,
            institution_name,
            current_gpa,
            gpa_scale,
            annual_budget,
            budget_currency,
            work_experience_months,
            leadership_experience,
            community_service,
            research_experience,
            international_student,
            currently_enrolled,
            gdsc_member,
            university_team_member,
            achievements,
            innovation_projects,
            partner_universities,
            additional_information
        FROM student_profiles
        WHERE user_id = %s
        LIMIT 1
        """,
        (user_id,),
    )

    return _normalize_profile(cursor.fetchone())


def _load_degrees(cursor, user_id: int) -> list[dict]:

    cursor.execute(
        """
        SELECT
            id,
            degree_level,
            degree_title,
            field_of_study,
            institution_name,
            completion_status,
            graduation_year,
            grade_value,
            grade_scale,
            created_at
        FROM student_degrees
        WHERE user_id = %s
        ORDER BY id ASC
        """,
        (user_id,),
    )

    return [
        _normalize_row(row)
        for row in (cursor.fetchall() or [])
    ]


def _load_language_proficiencies(
    cursor,
    user_id: int,
) -> list[dict]:

    cursor.execute(
        """
        SELECT
            id,
            language_code,
            proficiency_type,
            test_name,
            score_numeric,
            proficiency_level,
            test_date,
            expiry_date,
            created_at,
            updated_at
        FROM student_language_proficiencies
        WHERE user_id = %s
        ORDER BY id ASC
        """,
        (user_id,),
    )

    return [
        _normalize_row(row)
        for row in (cursor.fetchall() or [])
    ]


def _load_documents(cursor, user_id: int) -> list[dict]:

    cursor.execute(
        """
        SELECT
            id,
            user_id,
            checklist_id,
            has_document,
            original_filename,
            file_size_bytes,
            created_at,
            updated_at
        FROM user_documents
        WHERE user_id = %s
        ORDER BY id ASC
        """,
        (user_id,),
    )

    documents = []

    for row in (cursor.fetchall() or []):
        document = _normalize_row(row)

        document["has_document"] = bool(
            document["has_document"]
        )

        documents.append(document)

    return documents


def _load_profile_attributes(
    cursor,
    user_id: int,
) -> list[dict]:

    cursor.execute(
        """
        SELECT
            id,
            user_id,
            attribute_key,
            attribute_value,
            country_code,
            source_type,
            updated_at
        FROM student_profile_attributes
        WHERE user_id = %s
        ORDER BY id ASC
        """,
        (user_id,),
    )

    attributes = []

    for row in (cursor.fetchall() or []):
        attribute = _normalize_row(row)

        attribute["attribute_value"] = _decode_json(
            attribute.get("attribute_value")
        )

        attributes.append(attribute)

    return attributes


# =========================================================
# SHARED STUDENT DATA SERVICE
# =========================================================

def load_student_data(cursor, user_id: int) -> dict:
    """
    Load all student information required by the API
    and scholarship matching engine.

    This function:
    - Uses the caller's existing database cursor.
    - Does not open or close a database connection.
    - Does not modify database records.
    - Normalizes database values.
    """

    if not isinstance(user_id, int) or user_id <= 0:
        raise ValueError(
            "A valid positive user_id is required."
        )

    profile = _load_profile(cursor, user_id)
    if profile is not None:
        profile["age"] = calculate_age(
            profile.get("date_of_birth")
        )

    degrees = _load_degrees(cursor, user_id)

    languages = _load_language_proficiencies(
        cursor,
        user_id,
    )

    documents = _load_documents(
        cursor,
        user_id,
    )

    attributes = _load_profile_attributes(
        cursor,
        user_id,
    )

    # Full document records indexed by checklist ID.
    documents_by_checklist_id = {
        document["checklist_id"]: document
        for document in documents
        if document.get("checklist_id") is not None
    }

    # Boolean-only lookup for eligibility checks.
    document_status_by_checklist_id = {
        document["checklist_id"]: document["has_document"]
        for document in documents
        if document.get("checklist_id") is not None
    }

    return {
        "user_id": user_id,
        "profile_exists": profile is not None,
        "profile": profile,
        "degrees": degrees,
        "languages": languages,
        "documents": documents,
        "documents_by_checklist_id": documents_by_checklist_id,
        "document_status_by_checklist_id": (
            document_status_by_checklist_id
        ),
        "attributes": attributes,
    }