"""
Level 1: Scholarship document matching.

A scholarship document is matched to a student's document when the
normalized scholarship document name matches the student's checklist_id.
This is a checklist-based availability match; it does not inspect or
verify the contents of an uploaded file.
"""

import re


DOCUMENT_MATCH_POINTS = 3


def normalize_document_key(value):
    """Normalize case and repeated whitespace for checklist matching."""
    if value is None:
        return ""
    return re.sub(r"\\s+", " ", str(value).strip()).casefold()


def _as_bool(value):
    """Interpret common MySQL, JSON, and form boolean representations."""
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        return value.strip().casefold() in {"1", "true", "yes", "y", "on"}
    return False


def evaluate_document_matches(scholarship_documents, student_data):
    """
    Return every scholarship document with its own status and score.

    Missing student checklist rows count as unavailable. Mandatory and
    optional documents both carry the configured per-document score,
    while their statuses remain distinct for reporting.
    """
    student_data = student_data if isinstance(student_data, dict) else {}
    student_documents = student_data.get("documents_by_checklist_id") or {}

    student_lookup = {}
    if isinstance(student_documents, dict):
        for checklist_id, record in student_documents.items():
            key = normalize_document_key(checklist_id)
            if key and isinstance(record, dict):
                student_lookup[key] = record

    results = []
    total_score = 0
    mandatory_count = 0
    optional_count = 0
    matched_count = 0
    missing_mandatory_count = 0
    missing_optional_count = 0

    for scholarship_document in scholarship_documents or []:
        document_name = scholarship_document.get("document_name")
        key = normalize_document_key(document_name)
        student_document = student_lookup.get(key) if key else None

        mandatory_value = scholarship_document.get("mandatory", True)
        if mandatory_value is None:
            mandatory_value = True
        mandatory = _as_bool(mandatory_value)

        has_document = _as_bool(
            student_document.get("has_document")
            if student_document
            else False
        )

        score = DOCUMENT_MATCH_POINTS if has_document else 0
        status = "met" if has_document else "not_met"

        if mandatory:
            mandatory_count += 1
            if not has_document:
                missing_mandatory_count += 1
        else:
            optional_count += 1
            if not has_document:
                missing_optional_count += 1

        if has_document:
            matched_count += 1

        total_score += score

        requirement = scholarship_document.get("requirement")
        condition_text = scholarship_document.get("condition_text")
        source_sentence = scholarship_document.get("source_sentence")

        results.append({
            "scholarship_document_id": scholarship_document.get("id"),
            "document_name": document_name,
            "checklist_id": (
                student_document.get("checklist_id")
                if student_document else None
            ),
            "mandatory": mandatory,
            "status": status,
            "student_has_document": has_document,
            "student_value": (
                "Available" if has_document else "Not available"
            ),
            "required_value": condition_text or requirement,
            "requirement": requirement,
            "condition_text": condition_text,
            "source_sentence": source_sentence,
            "score": score,
            "maximum_score": DOCUMENT_MATCH_POINTS,
            "percentage": (
                100.0 if has_document else 0.0
            ),
            "reason": (
                "The student marked this document as available in the "
                "document checklist."
                if has_document
                else "The student has not marked this document as available "
                "in the document checklist."
            ),
            "recommendation": (
                None if has_document else
                "Obtain this document and mark it as available in the "
                "student document checklist."
            ),
        })

    maximum_score = len(results) * DOCUMENT_MATCH_POINTS
    percentage = (
        round(total_score / maximum_score * 100, 2)
        if maximum_score
        else 0.0
    )

    return {
        "level": 1,
        "stage": "document_matching",
        "score": total_score,
        "maximum_score": maximum_score,
        "percentage": percentage,
        "total_documents": len(results),
        "matched_documents": matched_count,
        "missing_documents": (
            missing_mandatory_count + missing_optional_count
        ),
        "mandatory_documents": mandatory_count,
        "optional_documents": optional_count,
        "missing_mandatory_documents": missing_mandatory_count,
        "missing_optional_documents": missing_optional_count,
        "results": results,
    }
