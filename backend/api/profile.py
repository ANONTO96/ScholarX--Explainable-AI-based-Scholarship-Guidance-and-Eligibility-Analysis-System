import json
import re
from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from mysql.connector import Error, IntegrityError
from pydantic import BaseModel, Field

from api.auth.dependencies import get_current_user
from database.connection import get_db_connection
from services.student_profile_service import load_student_data


router = APIRouter(prefix="/api/profile", tags=["Profile"])


# =========================================================
# REQUEST MODELS
# =========================================================

class UsernameUpdateRequest(BaseModel):
    username: str = Field(min_length=3, max_length=30)


class LanguageQualification(BaseModel):
    language_code: str = Field(min_length=2, max_length=10)
    proficiency_type: str = Field(min_length=1, max_length=30)
    test_name: str | None = Field(default=None, max_length=80)
    score_numeric: Decimal | None = None
    score_text: str | None = Field(default=None, max_length=50)
    proficiency_level: str | None = Field(default=None, max_length=30)
    test_date: date | None = None
    expiry_date: date | None = None


class LanguageQualificationsRequest(BaseModel):
    qualifications: list[LanguageQualification] = Field(default_factory=list)


# =========================================================
# DATABASE AND COMMON HELPERS
# =========================================================

def _connection():
    try:
        return get_db_connection()
    except Error:
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to the database."
        )


def _decode_json(value: Any, default: Any):
    if value is None or value == "":
        return default

    if isinstance(value, (dict, list)):
        return value

    if isinstance(value, (bytes, bytearray)):
        value = value.decode("utf-8")

    try:
        return json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return default


def _encode_json(value: Any):
    return json.dumps(value, ensure_ascii=False, default=str)


def _as_decimal(value: Any):
    if value is None or value == "":
        return None

    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError):
        return None


def _as_int(value: Any):
    if value is None or value == "":
        return None

    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _as_nullable_bool(value: Any):
    if value is None or value == "":
        return None

    if isinstance(value, bool):
        return value

    if isinstance(value, int) and value in (0, 1):
        return bool(value)

    if isinstance(value, str):
        normalized = value.strip().lower()

        if normalized in ("true", "yes", "1"):
            return True

        if normalized in ("false", "no", "0"):
            return False

    return None


def _db_bool(value):
    return None if value is None else bool(value)


# =========================================================
# PROFILE HELPERS
# =========================================================

def _ensure_profile_exists(cursor, user_id: int):
    cursor.execute(
        """
        SELECT user_id
        FROM student_profiles
        WHERE user_id = %s
        LIMIT 1
        """,
        (user_id,)
    )

    if cursor.fetchone() is None:
        cursor.execute(
            """
            INSERT INTO student_profiles (user_id)
            VALUES (%s)
            """,
            (user_id,)
        )


def _format_language_qualifications(rows: list[dict] | None):
    """
    Format language qualification rows into the existing
    frontend response structure.
    """

    result = []

    for row in rows or []:
        test_date = row.get("test_date")
        expiry_date = row.get("expiry_date")

        result.append({
            "id": row.get("id"),
            "language_code": row.get("language_code"),
            "proficiency_type": row.get("proficiency_type"),
            "test_name": row.get("test_name"),

            "score_numeric": (
                str(row["score_numeric"])
                if row.get("score_numeric") is not None
                else None
            ),

            "score_text": row.get("score_text"),
            "proficiency_level": row.get("proficiency_level"),

            "test_date": (
                test_date.isoformat()
                if hasattr(test_date, "isoformat")
                else test_date
            ),

            "expiry_date": (
                expiry_date.isoformat()
                if hasattr(expiry_date, "isoformat")
                else expiry_date
            ),
        })

    return sorted(
        result,
        key=lambda item: item.get("id") or 0
    )


def _profile_row_to_frontend(row: dict | None, user: dict):
    row = row or {}

    extra = _decode_json(
        row.get("additional_information"),
        {}
    )

    if not isinstance(extra, dict):
        extra = {}

    academic_extra = (
        extra.get("academic")
        if isinstance(extra.get("academic"), dict)
        else {}
    )

    preferences_extra = (
        extra.get("preferences")
        if isinstance(extra.get("preferences"), dict)
        else {}
    )

    performance = academic_extra.get("academicPerformance")

    if not isinstance(performance, dict):
        performance = {
            "gpa": (
                str(row["current_gpa"])
                if row.get("current_gpa") is not None
                else None
            ),
            "scale": (
                str(row["gpa_scale"])
                if row.get("gpa_scale") is not None
                else None
            ),
        }

    achievements = _decode_json(
        row.get("achievements"),
        []
    )

    projects = _decode_json(
        row.get("innovation_projects"),
        []
    )

    partner_universities = _decode_json(
        row.get("partner_universities"),
        []
    )

    date_of_birth = row.get("date_of_birth")

    return {
        "username": user.get("username", ""),

        "personal": {
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "nationality": row.get("nationality"),

            "dateOfBirth": (
                date_of_birth.isoformat()
                if hasattr(date_of_birth, "isoformat")
                else date_of_birth
            ),
        },

        "academic": {
            "studyLevel": row.get("current_study_level"),

            "completedDegrees": academic_extra.get(
                "completedDegrees",
                []
            ),

            "fieldOfStudy": row.get("field_of_study"),
            "academicPerformance": performance,
            "institutionName": row.get("institution_name"),
        },

        "preferences": {
            "studyDestination": preferences_extra.get(
                "studyDestination",
                extra.get("studyDestination")
            ),

            "annualBudget": {
                "currency": row.get("budget_currency"),

                "amount": (
                    str(row["annual_budget"])
                    if row.get("annual_budget") is not None
                    else None
                ),
            },
        },

        "experience": {
            "workExperienceMonths": row.get(
                "work_experience_months"
            ),

            "leadershipExperience": _db_bool(
                row.get("leadership_experience")
            ),

            "communityService": _db_bool(
                row.get("community_service")
            ),

            "researchExperience": _db_bool(
                row.get("research_experience")
            ),

            "achievements": (
                achievements
                if isinstance(achievements, list)
                else []
            ),
        },

        "additional": {
            "internationalStudent": _db_bool(
                row.get("international_student")
            ),

            "isStudent": _db_bool(
                row.get("currently_enrolled")
            ),

            "gdscMember": _db_bool(
                row.get("gdsc_member")
            ),

            "universityTeam": _db_bool(
                row.get("university_team_member")
            ),

            "partnerUniversities": (
                partner_universities
                if isinstance(partner_universities, list)
                else []
            ),

            "innovationProjects": (
                projects
                if isinstance(projects, list)
                else []
            ),
        },
    }


# =========================================================
# PROFILE SAVE CONVERSION
# =========================================================

def _profile_to_columns(profile: dict):
    personal = (
        profile.get("personal")
        if isinstance(profile.get("personal"), dict)
        else {}
    )

    academic = (
        profile.get("academic")
        if isinstance(profile.get("academic"), dict)
        else {}
    )

    preferences = (
        profile.get("preferences")
        if isinstance(profile.get("preferences"), dict)
        else {}
    )

    experience = (
        profile.get("experience")
        if isinstance(profile.get("experience"), dict)
        else {}
    )

    additional = (
        profile.get("additional")
        if isinstance(profile.get("additional"), dict)
        else {}
    )

    budget = (
        preferences.get("annualBudget")
        if isinstance(preferences.get("annualBudget"), dict)
        else {}
    )

    performance = academic.get("academicPerformance")

    gpa = None
    gpa_scale = None

    if isinstance(performance, dict):
        gpa = _as_decimal(
            performance.get(
                "gpa",
                performance.get("value")
            )
        )

        gpa_scale = _as_decimal(
            performance.get(
                "scale",
                performance.get("maxGpa")
            )
        )

    elif performance not in (None, ""):
        gpa = _as_decimal(performance)

    dob_value = (
        personal.get("dateOfBirth")
        or personal.get("date_of_birth")
    )

    if dob_value in ("", None):
        dob = None
    else:
        try:
            dob = date.fromisoformat(str(dob_value))
        except ValueError:
            raise HTTPException(
                status_code=422,
                detail="Date of birth must use YYYY-MM-DD format."
            )

    columns = {
        "nationality": personal.get("nationality") or None,
        "date_of_birth": dob,

        "current_study_level": (
            academic.get("studyLevel") or None
        ),

        "field_of_study": (
            academic.get("fieldOfStudy") or None
        ),

        "institution_name": (
            academic.get("institutionName") or None
        ),

        "current_gpa": gpa,
        "gpa_scale": gpa_scale,

        "annual_budget": _as_decimal(
            budget.get("amount")
        ),

        "budget_currency": (
            budget.get("currency") or None
        ),

        "work_experience_months": _as_int(
            experience.get("workExperienceMonths")
        ),

        "leadership_experience": _as_nullable_bool(
            experience.get("leadershipExperience")
        ),

        "community_service": _as_nullable_bool(
            experience.get("communityService")
        ),

        "research_experience": _as_nullable_bool(
            experience.get("researchExperience")
        ),

        "international_student": _as_nullable_bool(
            additional.get("internationalStudent")
        ),

        "currently_enrolled": _as_nullable_bool(
            additional.get("isStudent")
        ),

        "gdsc_member": _as_nullable_bool(
            additional.get("gdscMember")
        ),

        "university_team_member": _as_nullable_bool(
            additional.get("universityTeam")
        ),

        "achievements": _encode_json(
            experience.get("achievements", [])
        ),

        "innovation_projects": _encode_json(
            additional.get("innovationProjects", [])
        ),

        "partner_universities": _encode_json(
            additional.get("partnerUniversities", [])
        ),
    }

    # Preserve the existing additional_information JSON structure.
    extra = {
        "academic": {
            "completedDegrees": academic.get(
                "completedDegrees",
                []
            ),

            "academicPerformance": performance,
        },

        "preferences": {
            "studyDestination": preferences.get(
                "studyDestination"
            ),
        },

        "studyDestination": preferences.get(
            "studyDestination"
        ),

        "additional": {
            "additionalInformation": additional.get(
                "additionalInformation"
            ),
        },
    }

    columns["additional_information"] = _encode_json(extra)

    return columns


# =========================================================
# PROFILE COMPLETION
# =========================================================

def _completion(profile: dict, qualifications: list[dict]):
    # Each criterion counts equally.
    # Explicit False and numeric zero count as answered.

    academic_performance = (
        profile.get("academic", {}).get("academicPerformance")
    )

    if isinstance(academic_performance, dict):
        gpa_completed = (
            academic_performance.get("gpa") not in (None, "")
        )

        scale_completed = (
            academic_performance.get("scale") not in (None, "")
        )
    else:
        gpa_completed = bool(academic_performance)
        scale_completed = False

    checks = [
        (
            "Full name",
            bool(profile.get("personal", {}).get("name"))
        ),

        (
            "Email",
            bool(profile.get("personal", {}).get("email"))
        ),

        (
            "Nationality",
            bool(profile.get("personal", {}).get("nationality"))
        ),

        (
            "Date of birth",
            bool(profile.get("personal", {}).get("dateOfBirth"))
        ),

        (
            "Current study level",
            bool(profile.get("academic", {}).get("studyLevel"))
        ),

        (
            "Field of study",
            bool(profile.get("academic", {}).get("fieldOfStudy"))
        ),

        (
            "Institution name",
            bool(profile.get("academic", {}).get("institutionName"))
        ),

        ("GPA", gpa_completed),

        ("GPA scale", scale_completed),

        (
            "Preferred destination",
            bool(profile.get("preferences", {}).get("studyDestination"))
        ),

        (
            "Annual budget",
            profile.get("preferences", {})
            .get("annualBudget", {})
            .get("amount") not in (None, "")
        ),

        (
            "Work experience",
            profile.get("experience", {})
            .get("workExperienceMonths") not in (None, "")
        ),

        (
            "Leadership experience",
            profile.get("experience", {})
            .get("leadershipExperience") is not None
        ),

        (
            "Community service",
            profile.get("experience", {})
            .get("communityService") is not None
        ),

        (
            "Research experience",
            profile.get("experience", {})
            .get("researchExperience") is not None
        ),

        (
            "Enrollment status",
            profile.get("additional", {})
            .get("isStudent") is not None
        ),

        (
            "Language qualification",
            len(qualifications) > 0
        ),
    ]

    total = len(checks)

    completed = sum(
        1 for _, done in checks if done
    )

    missing = [
        name
        for name, done in checks
        if not done
    ]

    return {
        "percentage": (
            round(completed * 100 / total)
            if total
            else 0
        ),

        "completed": completed,
        "total": total,
        "missing_fields": missing,
    }


# =========================================================
# USER AND SHARED PROFILE RESPONSE
# =========================================================

def _load_user(cursor, user_id: int):
    cursor.execute(
        """
        SELECT id, name, username, email, role
        FROM users
        WHERE id = %s
        LIMIT 1
        """,
        (user_id,)
    )

    return cursor.fetchone()


def _profile_response(cursor, user_id: int):
    user = _load_user(cursor, user_id)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User account not found."
        )

    # Shared service retrieves all student-related tables.
    student_data = load_student_data(cursor, user_id)

    row = student_data["profile"]

    profile = _profile_row_to_frontend(
        row,
        user
    )

    qualifications = _format_language_qualifications(
        student_data["languages"]
    )

    return {
        "status": "success",

        "user": user,

        "profile": profile,

        "completion": _completion(
            profile,
            qualifications
        ),

        "student_data": {
            "degrees": student_data["degrees"],

            "languages": qualifications,

            "documents": student_data["documents"],

            "documents_by_checklist_id": (
                student_data["documents_by_checklist_id"]
            ),

            "attributes": student_data["attributes"],
        },
    }


# =========================================================
# GET PROFILE
# =========================================================

@router.get("/me")
def get_profile(
    current_user: dict = Depends(get_current_user)
):
    connection = _connection()
    cursor = connection.cursor(dictionary=True)

    try:
        user_id = current_user["user_id"]

        _ensure_profile_exists(
            cursor,
            user_id
        )

        connection.commit()

        return _profile_response(
            cursor,
            user_id
        )

    except HTTPException:
        connection.rollback()
        raise

    except Error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve profile."
        )

    finally:
        cursor.close()
        connection.close()


# =========================================================
# UPDATE PROFILE
# =========================================================

@router.put("/me")
def save_profile(
    profile: dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    connection = _connection()
    cursor = connection.cursor(dictionary=True)

    try:
        user_id = current_user["user_id"]

        _ensure_profile_exists(
            cursor,
            user_id
        )

        columns = _profile_to_columns(profile)

        assignments = ", ".join(
            f"{column} = %s"
            for column in columns
        )

        cursor.execute(
            f"""
            UPDATE student_profiles
            SET {assignments}
            WHERE user_id = %s
            """,
            list(columns.values()) + [user_id]
        )

        connection.commit()

        return _profile_response(
            cursor,
            user_id
        ) | {
            "message": "Profile saved successfully."
        }

    except HTTPException:
        connection.rollback()
        raise

    except Error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to save profile."
        )

    finally:
        cursor.close()
        connection.close()


# =========================================================
# GET LANGUAGE QUALIFICATIONS
# =========================================================

@router.get("/languages")
def get_language_qualifications(
    current_user: dict = Depends(get_current_user)
):
    connection = _connection()
    cursor = connection.cursor(dictionary=True)

    try:
        student_data = load_student_data(
            cursor,
            current_user["user_id"]
        )

        items = _format_language_qualifications(
            student_data["languages"]
        )

        return {
            "status": "success",
            "qualifications": items
        }

    except Error:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve language qualifications."
        )

    finally:
        cursor.close()
        connection.close()


# =========================================================
# UPDATE LANGUAGE QUALIFICATIONS
# =========================================================

@router.put("/languages")
def save_language_qualifications(
    data: LanguageQualificationsRequest,
    current_user: dict = Depends(get_current_user)
):
    connection = _connection()
    cursor = connection.cursor(dictionary=True)

    try:
        user_id = current_user["user_id"]

        cursor.execute(
            """
            DELETE FROM student_language_proficiencies
            WHERE user_id = %s
            """,
            (user_id,)
        )

        for item in data.qualifications:
            cursor.execute(
                """
                INSERT INTO student_language_proficiencies
                    (
                        user_id,
                        language_code,
                        proficiency_type,
                        test_name,
                        score_numeric,
                        score_text,
                        proficiency_level,
                        test_date,
                        expiry_date
                    )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    user_id,

                    item.language_code.strip().upper(),

                    item.proficiency_type.strip().lower(),

                    (
                        item.test_name.strip()
                        if item.test_name
                        else None
                    ),

                    item.score_numeric,

                    (
                        item.score_text.strip()
                        if item.score_text
                        else None
                    ),

                    (
                        item.proficiency_level.strip()
                        if item.proficiency_level
                        else None
                    ),

                    item.test_date,
                    item.expiry_date,
                )
            )

        connection.commit()

        profile_response = _profile_response(
            cursor,
            user_id
        )

        return {
            "status": "success",

            "message": (
                "Language qualifications saved successfully."
            ),

            "qualifications": (
                profile_response["student_data"]["languages"]
            ),

            "completion": profile_response["completion"],
        }

    except HTTPException:
        connection.rollback()
        raise

    except Error as e:
        print("MYSQL ERROR:", repr(e))

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to save language qualifications."
        )

    except Exception as e:
        print("PYTHON ERROR:", repr(e))

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to save language qualifications."
        )

    finally:
        cursor.close()
        connection.close()


# =========================================================
# UPDATE USERNAME
# =========================================================

@router.patch("/me/username")
def update_username(
    data: UsernameUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    username = data.username.strip()

    if not re.fullmatch(
        r"[a-zA-Z0-9._-]{3,30}",
        username
    ):
        raise HTTPException(
            status_code=422,
            detail=(
                "Username must be 3–30 characters and may contain "
                "letters, numbers, dots, underscores, or hyphens."
            )
        )

    connection = _connection()
    cursor = connection.cursor(dictionary=True)

    try:
        user_id = current_user["user_id"]

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE username = %s
              AND id <> %s
            LIMIT 1
            """,
            (username, user_id)
        )

        if cursor.fetchone():
            raise HTTPException(
                status_code=409,
                detail="Username is already taken."
            )

        cursor.execute(
            """
            UPDATE users
            SET username = %s
            WHERE id = %s
            """,
            (username, user_id)
        )

        connection.commit()

        return {
            "status": "success",

            "message": "Username updated successfully.",

            "user": _load_user(
                cursor,
                user_id
            ),
        }

    except HTTPException:
        connection.rollback()
        raise

    except IntegrityError:
        connection.rollback()

        raise HTTPException(
            status_code=409,
            detail="Username is already taken."
        )

    except Error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to update username."
        )

    finally:
        cursor.close()
        connection.close()