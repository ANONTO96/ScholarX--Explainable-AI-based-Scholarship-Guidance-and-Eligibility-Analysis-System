"""Independent Level 2 language proficiency matching."""


def _normalise_language(value):
    value = str(value or "").strip().lower().replace("_", "-")
    aliases = {
        "en": "english", "eng": "english", "zh": "chinese",
        "zh-cn": "chinese", "zh-tw": "chinese", "cmn": "chinese",
        "ja": "japanese", "jp": "japanese", "ko": "korean",
        "kr": "korean", "tr": "turkish", "fr": "french",
        "de": "german", "es": "spanish", "ar": "arabic",
        "ru": "russian", "it": "italian", "pt": "portuguese",
    }
    return aliases.get(value, value)


def _has_moi_document(student_data):
    """Check only the agreed MOI checklist identifier; never legacy english-test."""
    by_checklist = student_data.get("documents_by_checklist_id") or {}
    moi = by_checklist.get("moi-doc")
    if isinstance(moi, dict) and bool(moi.get("has_document")):
        return True
    if isinstance(moi, bool):
        return moi

    status_map = student_data.get("document_status_by_checklist_id") or {}
    if bool(status_map.get("moi-doc")):
        return True

    for document in student_data.get("documents") or []:
        if not isinstance(document, dict):
            continue
        if str(document.get("checklist_id") or "").strip().lower() == "moi-doc":
            if bool(document.get("has_document")):
                return True
    return False


def evaluate_language_proficiency_matches(program_languages, student_data):
    """Match every required program language once against student evidence.

    English is satisfied by either an MOI document (moi-doc) or an English
    proficiency-test record. Other languages require a corresponding test
    record in student_language_proficiencies.
    """
    required_languages = []
    seen = set()
    for language in program_languages or []:
        if not isinstance(language, str) or not language.strip():
            continue
        display_name = language.strip()
        key = _normalise_language(display_name)
        if key and key not in seen:
            required_languages.append((display_name, key))
            seen.add(key)

    proficiency_records = [
        record for record in (student_data.get("languages") or [])
        if isinstance(record, dict)
    ]
    moi_available = _has_moi_document(student_data)

    results = []
    matched_count = 0

    for display_name, language_key in required_languages:
        matching_records = [
            record for record in proficiency_records
            if _normalise_language(record.get("language_code")) == language_key
        ]

        evidence = []
        if language_key == "english":
            if moi_available:
                evidence.append({"type": "moi_document", "document_id": "moi-doc"})
            for record in matching_records:
                evidence.append({
                    "type": "proficiency_test",
                    "test_name": record.get("test_name"),
                    "proficiency_type": record.get("proficiency_type"),
                    "score": record.get("score_numeric"),
                    "proficiency_level": record.get("proficiency_level"),
                })
        else:
            for record in matching_records:
                evidence.append({
                    "type": "proficiency_test",
                    "test_name": record.get("test_name"),
                    "proficiency_type": record.get("proficiency_type"),
                    "score": record.get("score_numeric"),
                    "proficiency_level": record.get("proficiency_level"),
                })

        matched = bool(evidence)
        matched_count += int(matched)
        results.append({
            "language_name": display_name,
            "language": display_name,
            "matched": matched,
            "status": "matched" if matched else "not_matched",
            "evidence": evidence,
            "matched_by": [item["type"] for item in evidence],
        })

    total = len(results)
    percentage = round((matched_count / total) * 100, 2) if total else 0.0

    return {
        "score": matched_count,
        "maximum_score": total,
        "percentage": percentage,
        "matching_percentage": percentage,
        "total_required_languages": total,
        "matched_languages": matched_count,
        "unmatched_languages": total - matched_count,
        "required_languages": [name for name, _ in required_languages],
        "languages": results,
    }
