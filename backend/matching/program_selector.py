"""
ScholarX program selector.

- current_study_level directly selects the scholarship program.
- Completed qualifications are collected independently from structured
  student_degrees rows and profile.additional_information.academic.completedDegrees.
- Profile JSON qualifications retain their source label; they are not
  represented as structured verified degree records.
"""

import re
import json


DEGREE_ALIASES = {
    "high school diploma": "high school",
    "secondary school": "high school",
    "ssc": "high school",
    "higher secondary certificate": "higher secondary",
    "higher secondary": "higher secondary",
    "hsc": "higher secondary",
    "diploma": "diploma",
    "bsc": "bachelor",
    "b sc": "bachelor",
    "bachelor of science": "bachelor",
    "bachelor of arts": "bachelor",
    "bachelor of engineering": "bachelor",
    "bachelor of technology": "bachelor",
    "bachelors": "bachelor",
    "bachelors degree": "bachelor",
    "bachelor degree": "bachelor",
    "undergraduate": "bachelor",
    "msc": "master",
    "m sc": "master",
    "master of science": "master",
    "master of arts": "master",
    "masters": "master",
    "masters degree": "master",
    "master degree": "master",
    "doctorate": "doctoral",
    "phd": "doctoral",
    "ph d": "doctoral",
    "phd degree": "doctoral",
    "doctoral degree": "doctoral",
}

DEGREE_RANKS = {
    "high school": 1,
    "higher secondary": 1,
    "diploma": 1,
    "bachelor": 2,
    "master": 3,
    "doctoral": 4,
}

COMPLETED_STATUSES = {"completed", "complete", "graduated"}


def normalize_degree(value):
    """Normalize degree/program labels into canonical comparable values."""
    if not value:
        return None

    value = str(value).strip().lower()
    value = value.replace("’", "'").replace("'", "")
    value = re.sub(r"[.,]", " ", value)
    value = re.sub(r"\s+", " ", value).strip()

    if value in DEGREE_ALIASES:
        return DEGREE_ALIASES[value]

    # Handle profile labels such as "Bsc In CSE" without classifying
    # arbitrary text as a degree.
    prefix_patterns = (
        (r"^(?:b\s*sc|bachelor(?:s)?(?: degree)?|bachelor of science)\b", "bachelor"),
        (r"^(?:m\s*sc|master(?:s)?(?: degree)?|master of science)\b", "master"),
        (r"^(?:ph\s*d|doctorate|doctoral)\b", "doctoral"),
        (r"^(?:hsc|higher secondary)\b", "higher secondary"),
        (r"^(?:ssc|high school)\b", "high school"),
    )
    for pattern, canonical in prefix_patterns:
        if re.match(pattern, value):
            return canonical

    return value


def get_degree_rank(value):
    normalized = normalize_degree(value)
    return DEGREE_RANKS.get(normalized) if normalized else None


def determine_target_level(current_study_level):
    """Use the requested current_study_level directly; do not progress it."""
    return normalize_degree(current_study_level)


def collect_completed_degrees(student_data):
    """Collect completed qualifications from both supported profile sources."""
    collected = []
    seen = set()

    def add_degree(name, source, record=None):
        rank = get_degree_rank(name)
        if rank is None:
            return

        key = (normalize_degree(name), source)
        if key in seen:
            return
        seen.add(key)

        record = record or {}
        collected.append({
            "degree_level": name,
            "normalized_level": normalize_degree(name),
            "rank": rank,
            "degree_title": record.get("degree_title"),
            "institution_name": record.get("institution_name"),
            "graduation_year": record.get("graduation_year"),
            "source": source,
        })

    # Structured records: include only explicit completed statuses.
    for degree in student_data.get("degrees") or []:
        status = str(degree.get("completion_status") or "").strip().lower()
        if status in COMPLETED_STATUSES:
            name = degree.get("degree_level") or degree.get("degree_title")
            add_degree(name, "student_degrees", degree)

    # Profile JSON: the field itself is named completedDegrees.
    profile = student_data.get("profile") or {}
    additional_info = profile.get("additional_information") or {}
    if isinstance(additional_info, str):
        try:
            additional_info = json.loads(additional_info)
        except (TypeError, ValueError):
            additional_info = {}

    academic_info = (
        additional_info.get("academic") or {}
        if isinstance(additional_info, dict)
        else {}
    )
    profile_degrees = academic_info.get("completedDegrees", [])
    if isinstance(profile_degrees, list):
        for degree_name in profile_degrees:
            if isinstance(degree_name, str) and degree_name.strip():
                add_degree(degree_name, "profile_json")

    return collected


def get_highest_completed_degree(student_data):
    """Return the highest recognized completed qualification from either source."""
    completed = collect_completed_degrees(student_data)
    return max(completed, key=lambda item: item["rank"]) if completed else None


def find_matching_program(programs, target_level):
    """Find exactly one scholarship program matching the target level."""
    target = normalize_degree(target_level)
    matches = []

    for program in programs:
        program_level = program.get("program_name")
        if normalize_degree(program_level) == target:
            matches.append(program)

    if not matches:
        return None
    if len(matches) > 1:
        raise ValueError(f"Multiple scholarship programs match target level: {target}")
    return matches[0]


def select_scholarship_program(cursor, student_data, scholarship_id):
    """Select the program from current_study_level; caller owns the DB connection."""
    if not isinstance(scholarship_id, int) or scholarship_id <= 0:
        raise ValueError("A valid positive scholarship_id is required.")
    if not isinstance(student_data, dict):
        raise ValueError("student_data must be a dictionary.")

    profile = student_data.get("profile") or {}
    current_level = profile.get("current_study_level")
    target_level = determine_target_level(current_level)
    completed_degrees = collect_completed_degrees(student_data)
    highest_completed = (
        max(completed_degrees, key=lambda item: item["rank"])
        if completed_degrees else None
    )

    base_result = {
        "scholarship_id": scholarship_id,
        "current_study_level": current_level,
        "target_program_level": target_level,
        "highest_completed_degree": highest_completed,
        "completed_degrees": completed_degrees,
        "program": None,
    }

    if target_level is None:
        return {
            **base_result,
            "status": "unknown",
            "reason": (
                "Current study level is missing or not supported. "
                "The scholarship program cannot be determined."
            ),
        }

    cursor.execute(
        """
        SELECT id, scholarship_id, program_name, degree_level, duration, languages
        FROM scholarship_programs
        WHERE scholarship_id = %s
        ORDER BY id
        """,
        (scholarship_id,),
    )
    programs = cursor.fetchall() or []

    if not programs:
        return {
            **base_result,
            "status": "program_not_found",
            "reason": "No scholarship programs were found for this scholarship.",
        }

    selected_program = find_matching_program(programs, target_level)
    if selected_program is None:
        return {
            **base_result,
            "status": "program_not_found",
            "available_programs": programs,
            "reason": f"No {target_level} program was found for this scholarship.",
        }

    return {
        **base_result,
        "program": selected_program,
        "status": "selected",
        "reason": (
            f"The {target_level} program was selected directly from "
            f"current study level: {current_level}."
        ),
    }
