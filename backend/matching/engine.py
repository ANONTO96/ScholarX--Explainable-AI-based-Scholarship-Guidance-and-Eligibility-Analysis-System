import json

from database.connection import get_db_connection
from database.queries.eligibility_history import save_eligibility_history

from matching.profile_loader import load_student_profile
from matching.program_selector import select_scholarship_program
from matching.rule_loader import load_scholarship_rules
from matching.eligibility_scorer import calculate_eligibility_score
from matching.document_matcher import evaluate_document_matches
from matching.language_proficiency_matcher import evaluate_language_proficiency_matches
from matching.recommendation_engine import generate_recommendations

from matching.academic_matcher import evaluate_academic_rules
from matching.eligibility_evaluator import (
    evaluate_eligibility_rules,
    resolve_study_language,
)


def decode_json_value(value):
    """Decode JSON strings while preserving already-decoded values."""
    if isinstance(value, str):
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value

    return value


def build_program_context(program, scholarship_country=None):
    """Build normalized context from the selected scholarship program."""
    return {
        "program_id": program.get("id"),
        "program_name": program.get("program_name"),
        "degree_level": decode_json_value(
            program.get("degree_level")
        ),
        "duration": program.get("duration"),
        "languages": decode_json_value(
            program.get("languages")
        ),
        "country": scholarship_country,
    }


def analyze_scholarship(
    user_id: int,
    scholarship_id: int,
    preferred_study_language: str = None,
):
    """
    Run the complete scholarship matching pipeline.

    The user profile and scholarship rules are loaded from the database.
    The caller only supplies the user ID, scholarship ID, and optional
    preferred study language.
    """

    if not isinstance(user_id, int) or user_id <= 0:
        raise ValueError("A valid positive user_id is required.")

    if not isinstance(scholarship_id, int) or scholarship_id <= 0:
        raise ValueError("A valid positive scholarship_id is required.")

    # ---------------------------------------------------------
    # 1. LOAD STUDENT PROFILE
    # ---------------------------------------------------------

    student_data = load_student_profile(user_id)

    if not isinstance(student_data, dict):
        raise ValueError("Unable to load the student's profile.")

    # ---------------------------------------------------------
    # 2. SELECT SCHOLARSHIP PROGRAM AND LOAD RULES
    # ---------------------------------------------------------

    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor(dictionary=True)

        selection = select_scholarship_program(
            cursor=cursor,
            student_data=student_data,
            scholarship_id=scholarship_id,
        )

        if selection["status"] != "selected":
            return {
                "success": True,
                "status": selection["status"],
                "scholarship_id": scholarship_id,
                "program_selection": selection,
                "message": selection["reason"],
            }

        program = selection["program"]
        program_id = program["id"]

        cursor.execute(
            """
            SELECT country
            FROM scholarships
            WHERE id = %s
            """,
            (scholarship_id,)
        )

        scholarship_record = cursor.fetchone()

        scholarship_country = (
            scholarship_record.get("country")
            if scholarship_record
            else None
        )

        rules = load_scholarship_rules(
            cursor=cursor,
            scholarship_id=scholarship_id,
            program_id=program_id,
        )

        # Level 1: load scholarship document requirements.
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
        scholarship_documents = cursor.fetchall() or []


    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()

    # ---------------------------------------------------------
    # 3. BUILD PROGRAM CONTEXT
    # ---------------------------------------------------------

    program_context = build_program_context(
        program,
        scholarship_country,
    )
    program_languages = program_context.get("languages")

    # ---------------------------------------------------------
    # 4. RESOLVE STUDY LANGUAGE
    # ---------------------------------------------------------

    if isinstance(program_languages, str):
        program_languages = decode_json_value(program_languages)

    if not isinstance(program_languages, list) or not program_languages:
        return {
            "success": True,
            "status": "language_unavailable",
            "scholarship_id": scholarship_id,
            "program_id": program_id,
            "available_languages": [],
            "message": (
                "No valid study languages are configured "
                "for the selected program."
            ),
        }

    if len(program_languages) > 1 and not preferred_study_language:
        return {
            "success": True,
            "status": "language_selection_required",
            "scholarship_id": scholarship_id,
            "program_id": program_id,
            "available_languages": program_languages,
            "program_selection": selection,
            "message": "Please select your preferred study language.",
        }

    selected_language = resolve_study_language(
        program_languages,
        preferred_study_language,
    )

    program_context["study_language"] = selected_language

    # ---------------------------------------------------------
    # 5. EVALUATE ACADEMIC REQUIREMENTS
    # ---------------------------------------------------------

    academic_results = evaluate_academic_rules(
        student_data=student_data,
        rules=rules,
    )

    # ---------------------------------------------------------
    # 6. EVALUATE OTHER ELIGIBILITY REQUIREMENTS
    # ---------------------------------------------------------

    eligibility_results = evaluate_eligibility_rules(
        student_data=student_data,
        rules=rules,
        program_context=program_context,
        program_languages=program_languages,
        preferred_study_language=selected_language,
    )

    # ---------------------------------------------------------
    # 7. LEVEL 1: DOCUMENT MATCHING
    # ---------------------------------------------------------

    # Document matching is part of the same calculation pipeline as
    # academic and eligibility evaluation. Keep every document result
    # in the response so it can be persisted and displayed in history.
    document_matching = evaluate_document_matches(
        scholarship_documents=scholarship_documents,
        student_data=student_data,
    )

    # ---------------------------------------------------------
    # 8. LEVEL 2: LANGUAGE PROFICIENCY MATCHING
    # ---------------------------------------------------------

    # Only the language selected by the student is a requirement here.
    # program_languages is the list of all available study options; it must
    # not be passed wholesale to the Level 2 matcher.
    language_proficiency_matching = evaluate_language_proficiency_matches(
        program_languages=[selected_language],
        student_data=student_data,
    )

    # ---------------------------------------------------------
    # 9. COMBINE RULE RESULTS
    # ---------------------------------------------------------

    all_rule_results = academic_results + eligibility_results

    # ---------------------------------------------------------
    # 10. CALCULATE ELIGIBILITY SCORE
    # ---------------------------------------------------------

    eligibility_score = calculate_eligibility_score(
        all_rule_results
    )

    # ---------------------------------------------------------
    # 11. GENERATE IMPROVEMENT RECOMMENDATIONS
    # ---------------------------------------------------------

    recommendations = generate_recommendations(
        all_rule_results
    )

    # ---------------------------------------------------------
    # 12. RETURN COMPLETE ANALYSIS
    # ---------------------------------------------------------

    analysis_result = {
        "success": True,
        "status": "evaluated",
        "scholarship_id": scholarship_id,
        "program_id": program_id,
        "program_selection": selection,
        "program": program_context,
        "selected_study_language": selected_language,
        "total_rules": len(rules),
        "eligibility_score": eligibility_score,
        "document_matching": document_matching,
        "document_matching_score": document_matching["score"],
        "language_proficiency_matching": language_proficiency_matching,
        "academic_results": academic_results,
        "eligibility_results": eligibility_results,
        "recommendations": recommendations,
    }

    # Persist the complete calculation as one history record. The history
    # writer stores one row per rule and one row per scholarship document,
    # linked by the same check_uuid.
    check_uuid = save_eligibility_history(
        user_id=user_id,
        scholarship_id=scholarship_id,
        result=analysis_result,
    )

    analysis_result["check_uuid"] = check_uuid

    return analysis_result