"""
Eligibility evaluator for ScholarX.

Currently supports:
- age / minimum_age / maximum_age
- citizenship and nationality (International checkbox or specific nationality)
- health certificate and criminal-record / police-clearance checklist availability
- language_proficiency matching (existing general qualification matcher)
- direct test-score rules: IELTS, TOEFL, Duolingo, and PTE
- work-experience rules using student_profiles.work_experience_months
- entrance_exam

Missing or unverified information returns "unknown".
Conditional rules can return "not_applicable".
"""

import json
import re
from datetime import date, datetime


def compare_values(actual, operator, expected):
    """Compare numeric or string values using a supported operator."""
    if actual is None or expected is None:
        return None

    operators = {
        "=": lambda a, b: str(a).strip().lower() == str(b).strip().lower(),
        "!=": lambda a, b: str(a).strip().lower() != str(b).strip().lower(),
        ">": lambda a, b: float(a) > float(b),
        ">=": lambda a, b: float(a) >= float(b),
        "<": lambda a, b: float(a) < float(b),
        "<=": lambda a, b: float(a) <= float(b),
    }

    comparison = operators.get(operator)
    if comparison is None:
        return None

    try:
        return comparison(actual, expected)
    except (TypeError, ValueError):
        return None

def make_result(
    rule,
    status,
    reason,
    student_value=None,
    required_value=None,
    operator=None,
    comparison_value=None,
    comparison_operator=None,
):
    return {
        # Rule identification
        "rule_id": rule["id"],
        "rule_type": rule["rule_type"],
        "scope": rule.get("scope"),
        "category": rule.get("category"),

        # Original scholarship requirement
        "source_sentence": rule.get("source_sentence"),
        "condition_json": rule.get("condition_json"),
        "study_language": rule.get("study_language"),
        "rule_value": rule.get("rule_value"),

        # Evaluation result
        "mandatory": rule.get("mandatory", False),
        "status": status,
        "student_value": student_value,
        "required_value": required_value,
        "operator": operator,
        "comparison_value": comparison_value,
        "comparison_operator": comparison_operator,
        "reason": reason,
    }

def evaluate_condition(rule, program_context):
    """
    Check whether a conditional rule applies to the selected program.

    Returns:
        True  -> condition matches
        False -> condition does not match
        None  -> insufficient information
    """
    condition = rule.get("condition_json")

    if not condition:
        return True

    if isinstance(condition, str):
        try:
            condition = json.loads(condition)
        except json.JSONDecodeError:
            return None

    if not isinstance(condition, dict):
        return None

    field = condition.get("field")
    operator = condition.get("operator")
    expected = condition.get("value")
    actual = program_context.get(field)

    if actual is None:
        return None

    return compare_values(actual, operator, expected)

def evaluate_age(rule, profile):
    age = profile.get("age")
    required_age = rule.get("rule_value")
    operator = rule.get("operator")

    if age is None:
        return make_result(
            rule,
            "unknown",
            "Student age is not available in the profile.",
            required_value=required_age,
            operator=operator,
        )

    result = compare_values(
        age,
        operator,
        required_age,
    )

    if result is None:
        return make_result(
            rule,
            "unknown",
            "Unable to evaluate the age requirement because "
            "the comparison values or operator are invalid.",
            student_value=age,
            required_value=required_age,
            operator=operator,
        )

    if result:
        reason = (
            f"Student age ({age}) satisfies the requirement "
            f"of {operator} {required_age}."
        )
        status = "met"

    else:
        reason = (
            f"Student age ({age}) does not satisfy the requirement "
            f"of {operator} {required_age}."
        )
        status = "not_met"

    return make_result(
        rule,
        status,
        reason,
        student_value=age,
        required_value=required_age,
        operator=operator,
    )

def normalize_country_name(value):
    """Normalize common country-name variations."""
    if not value:
        return None

    country = str(value).strip().casefold()
    country = " ".join(country.split())

    aliases = {
        "turkiye": "turkey",
        "türkiye": "turkey",
        "republic of türkiye": "turkey",
        "republic of turkiye": "turkey",
        "prc": "china",
        "people's republic of china": "china",
        "united states of america": "united states",
        "usa": "united states",
        "uk": "united kingdom",
        "u.k.": "united kingdom",
        "republic of korea": "south korea",
        "korea, republic of": "south korea",
    }

    return aliases.get(country, country)


def get_country_from_rule(rule_value):
    """
    Convert a country name or recognized demonym into a normalized country.
    Returns None when the descriptor cannot be identified.
    """
    value = str(rule_value or "").strip().casefold()

    # Remove citizenship-related words safely.
    value = re.sub(
        r"\b(citizens?|nationals?|citizenship)\b",
        "",
        value
    )
    value = " ".join(value.split()).strip(" .,-")

    demonyms = {
        "turkish": "turkey",
        "chinese": "china",
        "japanese": "japan",
        "bangladeshi": "bangladesh",
        "indian": "india",
        "pakistani": "pakistan",
        "nepali": "nepal",
        "sri lankan": "sri lanka",
        "malaysian": "malaysia",
        "indonesian": "indonesia",
        "thai": "thailand",
        "vietnamese": "vietnam",
        "filipino": "philippines",
        "south korean": "south korea",
        "korean": "south korea",
        "american": "united states",
        "british": "united kingdom",
        "canadian": "canada",
        "australian": "australia",
        "new zealander": "new zealand",
        "german": "germany",
        "french": "france",
        "italian": "italy",
        "spanish": "spain",
        "portuguese": "portugal",
        "dutch": "netherlands",
        "swiss": "switzerland",
        "swedish": "sweden",
        "norwegian": "norway",
        "danish": "denmark",
        "finnish": "finland",
        "polish": "poland",
        "russian": "russia",
        "ukrainian": "ukraine",
        "turkmen": "turkmenistan",
        "iranian": "iran",
        "iraqi": "iraq",
        "saudi": "saudi arabia",
        "emirati": "united arab emirates",
        "egyptian": "egypt",
        "nigerian": "nigeria",
        "kenyan": "kenya",
        "south african": "south africa",
        "brazilian": "brazil",
        "argentinian": "argentina",
        "mexican": "mexico",
        "cuban": "cuba",
        "tanzanian": "tanzania",
        "ghanaian": "ghana",
        "moroccan": "morocco",
    }

    return demonyms.get(value, normalize_country_name(value))


def _as_optional_bool(value):
    """Return True/False for explicit boolean-like values, otherwise None."""
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        normalized = value.strip().casefold()
        if normalized in {"1", "true", "yes", "y", "on", "checked"}:
            return True
        if normalized in {"0", "false", "no", "n", "off", "unchecked"}:
            return False
    return None


def _get_checklist_document(student_data, checklist_ids):
    """Find a checklist row by one of its known IDs without guessing availability."""
    documents = student_data.get("documents_by_checklist_id") or {}
    if not isinstance(documents, dict):
        return None

    for checklist_id in checklist_ids:
        if checklist_id in documents:
            return documents[checklist_id]

    # Be tolerant of casing/whitespace in the keys returned by the profile service.
    normalized = {
        str(key).strip().casefold(): value
        for key, value in documents.items()
    }
    for checklist_id in checklist_ids:
        if checklist_id.casefold() in normalized:
            return normalized[checklist_id.casefold()]

    return None


def _evaluate_document_availability(rule, student_data, checklist_ids, label):
    document = _get_checklist_document(student_data, checklist_ids)

    if document is None:
        return make_result(
            rule,
            "unknown",
            f"{label} checklist information is not available.",
            required_value=rule.get("rule_value"),
        )

    raw_availability = (
        document.get("has_document")
        if isinstance(document, dict)
        else document
    )
    available = _as_optional_bool(raw_availability)

    if available is None:
        return make_result(
            rule,
            "unknown",
            f"{label} checklist row exists, but its availability is not specified.",
            required_value=rule.get("rule_value"),
        )

    if available:
        return make_result(
            rule,
            "met",
            f"Student has marked the {label.lower()} as available.",
            student_value="Available",
            required_value=rule.get("rule_value"),
        )

    return make_result(
        rule,
        "not_met",
        f"Student has marked the {label.lower()} as unavailable.",
        student_value="Not available",
        required_value=rule.get("rule_value"),
    )


def evaluate_health_certificate(rule, student_data):
    """Health eligibility is based only on the student's health-doc checklist row."""
    return _evaluate_document_availability(
        rule,
        student_data,
        ("health-doc", "health-certificate", "health_certificate"),
        "Health certificate",
    )


def evaluate_criminal_record(rule, student_data):
    """Criminal-record eligibility is based only on the PCC checklist row."""
    return _evaluate_document_availability(
        rule,
        student_data,
        ("pcc-doc", "criminal-record", "criminal_record", "police-clearance"),
        "Police clearance / criminal record certificate",
    )



def evaluate_english_proficiency(rule, student_data):
    """
    Evaluate generic English proficiency using two independent sources.

    1. user_documents:
       Checks English certificate availability.

    2. student_language_proficiencies:
       Checks English test name, score, and proficiency level.

    Either source can provide sufficient evidence for a generic
    English proficiency requirement.
    """

    languages = student_data.get("languages") or []

    required_value = rule.get("rule_value")

    # -----------------------------------------------------
    # 1. Check MOI / English-certificate checklist availability
    # -----------------------------------------------------

    english_document = _get_checklist_document(
        student_data,
        ("moi-doc", "english-test"),
    )

    certificate_available = (
        _as_optional_bool(
            english_document.get("has_document")
            if isinstance(english_document, dict)
            else english_document
        )
        if english_document is not None
        else None
    )

    # -----------------------------------------------------
    # 2. Find English proficiency records
    # -----------------------------------------------------

    english_records = []

    for record in languages:
        language_code = str(
            record.get("language_code") or ""
        ).strip().upper()

        if language_code not in {"EN", "ENG"}:
            continue

        test_name = str(
            record.get("test_name") or ""
        ).strip()

        score = record.get("score_numeric")
        score_text = record.get("score_text")
        proficiency_level = record.get("proficiency_level")

        if (
            score is not None
            or score_text
            or proficiency_level
        ):
            english_records.append({
                "test_name": test_name or "English qualification",
                "score_numeric": score,
                "score_text": score_text,
                "proficiency_level": proficiency_level,
            })

    # -----------------------------------------------------
    # 3. Build student evidence
    # -----------------------------------------------------

    student_values = []

    if certificate_available is True:
        student_values.append(
            "English certificate available"
        )

    elif certificate_available is False:
        student_values.append(
            "English certificate not available"
        )

    for record in english_records:
        details = [record["test_name"]]

        score = (
            record["score_numeric"]
            if record["score_numeric"] is not None
            else record["score_text"]
        )

        if score is not None:
            details.append(f"Score: {score}")

        if record["proficiency_level"]:
            details.append(
                f"Level: {record['proficiency_level']}"
            )

        student_values.append(" | ".join(details))

    student_value = (
        "; ".join(student_values)
        if student_values
        else None
    )

    # -----------------------------------------------------
    # 4. Evaluate independent evidence sources
    # -----------------------------------------------------

    # Either a certificate or an English proficiency record
    # is sufficient for this generic requirement.

    if certificate_available is True and english_records:
        reason = (
            "English certificate is marked as available, and "
            "English proficiency records were also found: "
            + ", ".join(
                record["test_name"]
                for record in english_records
            )
            + "."
        )

    elif certificate_available is True:
        reason = (
            "English proficiency certificate is marked as available."
        )

    elif english_records:
        reason = (
            "English proficiency records were found: "
            + ", ".join(
                record["test_name"]
                for record in english_records
            )
            + "."
        )

    elif certificate_available is False:
        return make_result(
            rule,
            "not_met",
            "English certificate is marked as unavailable, "
            "and no English proficiency test record was found.",
            student_value=student_value,
            required_value=required_value,
        )

    else:
        return make_result(
            rule,
            "unknown",
            "English certificate availability and proficiency "
            "information are unavailable.",
            student_value=student_value,
            required_value=required_value,
        )

    return make_result(
        rule,
        "met",
        reason,
        student_value=student_value,
        required_value=required_value,
    )



def parse_test_date(value):
    """Convert a database date value into a Python date."""
    if value is None:
        return None

    if isinstance(value, datetime):
        return value.date()

    if isinstance(value, date):
        return value

    try:
        return date.fromisoformat(str(value).strip())
    except (TypeError, ValueError):
        return None


def get_test_validity(language):
    """
    Determine whether a test record is currently valid.

    Returns:
        valid, expired, unknown
    """
    expiry_date = language.get("expiry_date")

    if expiry_date is None:
        return "unknown"

    parsed_expiry = parse_test_date(expiry_date)

    if parsed_expiry is None:
        return "unknown"

    if parsed_expiry < date.today():
        return "expired"

    return "valid"


def _get_international_student_flag(profile):
    """Read the explicit International-student checkbox; never infer it from nationality."""
    profile_additional = profile.get("additional")
    candidates = [
        profile.get("international_student"),
        profile.get("internationalStudent"),
        (
            profile_additional.get("internationalStudent")
            if isinstance(profile_additional, dict)
            else None
        ),
        (
            profile_additional.get("international_student")
            if isinstance(profile_additional, dict)
            else None
        ),
    ]

    additional_info = profile.get("additional_information") or {}
    if isinstance(additional_info, str):
        try:
            additional_info = json.loads(additional_info)
        except (TypeError, ValueError):
            additional_info = {}

    if isinstance(additional_info, dict):
        candidates.extend([
            additional_info.get("internationalStudent"),
            (additional_info.get("additional") or {}).get("internationalStudent")
            if isinstance(additional_info.get("additional"), dict)
            else None,
        ])

    for candidate in candidates:
        parsed = _as_optional_bool(candidate)
        if parsed is not None:
            return parsed

    return None


def evaluate_citizenship(rule, profile, scholarship_country=None):
    """
    International requirements use the profile's explicit checkbox.
    Specific-country citizenship requirements use the nationality field.
    """
    personal = profile.get("personal") or {}
    nationality = profile.get("nationality") or (
        personal.get("nationality") if isinstance(personal, dict) else None
    )
    rule_value = str(rule.get("rule_value") or "").strip()
    required_text = rule_value.casefold()

    if required_text in {"international", "international student"}:
        international_flag = _get_international_student_flag(profile)

        if international_flag is None:
            return make_result(
                rule,
                "unknown",
                "The International-student checkbox has not been answered in the profile.",
                student_value=nationality,
                required_value=rule_value,
                operator=rule.get("operator"),
            )

        return make_result(
            rule,
            "met" if international_flag else "not_met",
            (
                "The student's International-student checkbox is ticked."
                if international_flag
                else "The student's International-student checkbox is not ticked."
            ),
            student_value={
                "nationality": nationality,
                "international_student": international_flag,
            },
            required_value=rule_value,
            operator=rule.get("operator"),
            comparison_value=international_flag,
            comparison_operator="=",
        )

    if not nationality:
        return make_result(
            rule,
            "unknown",
            "Student nationality is not available in the profile.",
            required_value=rule_value,
        )

    if not rule_value:
        return make_result(
            rule,
            "unknown",
            "Citizenship requirement is not specified.",
            student_value=nationality,
        )

    student_country = normalize_country_name(nationality)
    is_negative = required_text.startswith(("non-", "non "))
    country_descriptor = (
        re.sub(r"^non[- ]", "", required_text)
        if is_negative
        else required_text
    )
    required_country = get_country_from_rule(country_descriptor)

    if not student_country or not required_country:
        return make_result(
            rule,
            "unknown",
            f"Unable to identify the country in the citizenship requirement: {rule_value}.",
            student_value=nationality,
            required_value=rule_value,
        )

    eligible = (
        student_country != required_country
        if is_negative
        else student_country == required_country
    )
    comparison_operator = "!=" if is_negative else "="

    return make_result(
        rule,
        "met" if eligible else "not_met",
        (
            f"The applicant's nationality ({nationality}) "
            f"{'satisfies' if eligible else 'does not satisfy'} "
            f"the citizenship requirement ({rule_value})."
        ),
        student_value=nationality,
        required_value=rule_value,
        operator=rule.get("operator"),
        comparison_value=required_country,
        comparison_operator=comparison_operator,
    )


def evaluate_language(rule, languages):
    """
    Evaluate specific IELTS and HSK language requirements.

    IELTS:
        Uses score_numeric and the scholarship rule operator.

    HSK:
        Compares the student's HSK level with the required level.

    Generic "University admission requirements" for Non-Chinese
    language rules are handled by evaluate_english_proficiency().
    """
    required = str(rule.get("rule_value") or "").strip()

    if not required:
        return make_result(
            rule,
            "unknown",
            "The required language proficiency is not configured.",
            required_value=rule.get("rule_value"),
        )

    normalized_required = required.lower()

    if normalized_required == "university admission requirements":
        return make_result(
            rule,
            "unknown",
            "University-specific language admission requirements "
            "have not been configured.",
            required_value=required,
        )

    # Identify the required test and its threshold.
    hsk_match = re.search(r"\bhsk\s*(\d+)\b", normalized_required)
    ielts_match = re.search(
        r"\bielts\s*(?:(>=|<=|>|<|=)\s*)?(\d+(?:\.\d+)?)",
        normalized_required
    )

    if hsk_match:
        test_type = "hsk"
        expected_level = int(hsk_match.group(1))

    elif ielts_match:
        test_type = "ielts"
        expected_score = float(ielts_match.group(2))
        operator = ielts_match.group(1) or rule.get("operator") or ">="

    else:
        return make_result(
            rule,
            "unknown",
            f"Unsupported language requirement: {required}",
            required_value=required,
        )

    if not languages:
        return make_result(
            rule,
            "unknown",
            "No language proficiency records are available.",
            required_value=required,
        )

    matching_records = []

    for language in languages:
        test_name = str(
            language.get("test_name") or ""
        ).strip().lower()

        if test_type == "hsk" and "hsk" not in test_name:
            continue

        if test_type == "ielts" and "ielts" not in test_name:
            continue

        matching_records.append(language)

    if not matching_records:
        return make_result(
            rule,
            "unknown",
            f"No {test_type.upper()} test record was found.",
            student_value="No matching test record",
            required_value=required,
        )

    valid_results = []
    unknown_records = []
    expired_records = []

    for language in matching_records:
        validity = get_test_validity(language)

        if validity == "expired":
            expired_records.append(language)
            continue

        if validity == "unknown":
            unknown_records.append(language)
            continue

        if test_type == "ielts":
            actual_score = language.get("score_numeric")

            if actual_score is None:
                unknown_records.append(language)
                continue

            result = compare_values(
                actual_score,
                operator,
                expected_score
            )

            if result is None:
                unknown_records.append(language)
                continue

            valid_results.append({
                "met": result,
                "score": actual_score
            })

        elif test_type == "hsk":
            actual_level = None

            values = [
                language.get("test_name"),
                language.get("score_text"),
                language.get("proficiency_level"),
            ]

            for value in values:
                if not value:
                    continue

                match = re.search(
                    r"\bhsk\s*(\d+)\b",
                    str(value).lower()
                )

                if match:
                    actual_level = int(match.group(1))
                    break

            if actual_level is None:
                unknown_records.append(language)
                continue

            valid_results.append({
                "met": actual_level >= expected_level,
                "level": actual_level
            })

    # A valid passing record is sufficient.
    for result in valid_results:
        if result["met"]:
            if test_type == "ielts":
                return make_result(
                    rule,
                    "met",
                    f"Valid IELTS score ({result['score']}) "
                    f"satisfies the {operator} {expected_score} requirement.",
                    student_value=result["score"],
                    required_value=expected_score,
                    operator=operator,
                )

            return make_result(
                rule,
                "met",
                f"Valid HSK level {result['level']} "
                f"satisfies the HSK {expected_level} requirement.",
                student_value=f"HSK {result['level']}",
                required_value=f"HSK {expected_level}",
                operator=">=",
            )

    # If another record could change the result, do not claim failure.
    if unknown_records:
        return make_result(
            rule,
            "unknown",
            "A matching language test record exists, but its score "
            "or validity cannot be verified.",
            student_value="Test record found; score or validity unverified",
            required_value=required,
        )

    if not valid_results and expired_records:
        return make_result(
            rule,
            "unknown",
            "Matching language test records were found, but all "
            "available records have expired.",
            student_value="Expired test record(s)",
            required_value=required,
        )

    if valid_results:
        if test_type == "ielts":
            best_score = max(
                float(result["score"])
                for result in valid_results
            )

            return make_result(
                rule,
                "not_met",
                f"Best valid IELTS score ({best_score}) "
                f"does not satisfy the {operator} {expected_score} requirement.",
                student_value=best_score,
                required_value=expected_score,
                operator=operator,
            )

        best_level = max(
            result["level"]
            for result in valid_results
        )

        return make_result(
            rule,
            "not_met",
            f"Best valid HSK level ({best_level}) "
            f"does not satisfy HSK {expected_level}.",
            student_value=f"HSK {best_level}",
            required_value=f"HSK {expected_level}",
            operator=">=",
        )

    return make_result(
        rule,
        "unknown",
        "Unable to verify the language proficiency requirement.",
        required_value=required,
    )


def _normalize_test_name(value):
    """Normalize test labels so rule_type and profile test_name can match."""
    normalized = re.sub(r"[^a-z0-9]+", "", str(value or "").casefold())
    aliases = {
        "ieltsacademic": "ielts",
        "ieltgeneraltraining": "ielts",
        "toeflibt": "toefl",
        "toefl": "toefl",
        "duolingoenglishtest": "duolingo",
        "det": "duolingo",
        "pteacademic": "pte",
        "pte": "pte",
    }
    return aliases.get(normalized, normalized)


def _normalize_rule_type(value):
    """Canonicalize direct rule names without changing stored rule_type."""
    raw = str(value or "").strip().casefold()
    if raw in {"work-experience", "work_experience", "work experience"}:
        return "work-experience"

    test_name = _normalize_test_name(raw)
    if test_name in {"ielts", "toefl", "duolingo", "pte"}:
        return test_name

    return raw


def _parse_work_experience_requirement(value):
    """
    Convert a work-experience requirement to months.

    Bare numeric values are months (e.g. 24 means 24 months).
    Explicit strings such as '2 years' and '24 months' are converted.
    """
    if value is None or value == "":
        return None

    if isinstance(value, (int, float)):
        return float(value)

    text = str(value).strip().casefold()
    match = re.fullmatch(r"(\d+(?:\.\d+)?)\s*(years?|yrs?|months?|mos?)?", text)
    if not match:
        return None

    amount = float(match.group(1))
    unit = match.group(2) or "months"
    if unit.startswith(("year", "yr")):
        return amount * 12
    return amount


def evaluate_test_score(rule, languages):
    """Compare a named test rule (IELTS/TOEFL/Duolingo/PTE) to score_numeric."""
    rule_type = _normalize_rule_type(rule.get("rule_type"))
    required_score = rule.get("rule_value")
    operator = rule.get("operator") or ">="

    try:
        required_score = float(required_score)
    except (TypeError, ValueError):
        return make_result(
            rule, "unknown",
            f"The required {rule.get('rule_type')} score is missing or invalid.",
            required_value=rule.get("rule_value"), operator=operator,
        )

    matching_records = [
        item for item in (languages or [])
        if _normalize_test_name(item.get("test_name")) == rule_type
    ]

    if not matching_records:
        display_name = str(rule.get("rule_type") or "language test")
        return make_result(
            rule, "unknown",
            f"No {display_name} test record was found in the student profile.",
            student_value="No matching test record",
            required_value=required_score, operator=operator,
        )

    comparable = []
    missing_score = False
    expired = []

    for record in matching_records:
        validity = get_test_validity(record)
        if validity == "expired":
            expired.append(record)
            continue

        score = record.get("score_numeric")
        if score is None or score == "":
            missing_score = True
            continue

        result = compare_values(score, operator, required_score)
        if result is None:
            missing_score = True
            continue

        comparable.append((float(score), result, validity))

    # A single verified passing test record is sufficient.
    passing = [entry for entry in comparable if entry[1] is True]
    if passing:
        score, _, validity = max(passing, key=lambda entry: entry[0])
        note = (
            " The test expiry date is not recorded, so expiry could not be verified."
            if validity == "unknown" else ""
        )
        return make_result(
            rule, "met",
            f"Student's {rule.get('rule_type')} score ({score:g}) meets the required score ({operator} {required_score:g}).{note}",
            student_value=score, required_value=required_score, operator=operator,
        )

    # Do not report a failure when another matching record has no score.
    if missing_score:
        return make_result(
            rule, "unknown",
            f"A {rule.get('rule_type')} record exists, but its numeric score is missing or invalid.",
            student_value="Test record found; score unavailable",
            required_value=required_score, operator=operator,
        )

    if not comparable and expired:
        return make_result(
            rule, "not_met",
            f"The student's {rule.get('rule_type')} test record has expired; a current valid test score is required.",
            student_value="Expired test record",
            required_value=required_score, operator=operator,
        )

    if comparable:
        # Show the most informative actual score for the failed comparison.
        score = max(entry[0] for entry in comparable) if operator in {">", ">="} else min(entry[0] for entry in comparable)
        return make_result(
            rule, "not_met",
            f"Student's {rule.get('rule_type')} score ({score:g}) does not meet the required score ({operator} {required_score:g}).",
            student_value=score, required_value=required_score, operator=operator,
        )

    return make_result(
        rule, "unknown",
        f"The student's {rule.get('rule_type')} score could not be verified.",
        required_value=required_score, operator=operator,
    )


def evaluate_work_experience(rule, profile):
    """Compare work-experience requirement with work_experience_months."""
    actual_months = profile.get("work_experience_months")
    required_months = _parse_work_experience_requirement(rule.get("rule_value"))
    operator = rule.get("operator") or ">="

    if actual_months is None or actual_months == "":
        return make_result(
            rule, "unknown",
            "Student work experience is not available in the profile.",
            required_value=required_months, operator=operator,
        )

    if required_months is None:
        return make_result(
            rule, "unknown",
            "The scholarship work-experience requirement is missing or invalid. Use months as the numeric unit (e.g. 24).",
            student_value=actual_months,
            required_value=rule.get("rule_value"), operator=operator,
        )

    result = compare_values(actual_months, operator, required_months)
    if result is None:
        return make_result(
            rule, "unknown",
            "The work-experience comparison could not be evaluated because the value or operator is invalid.",
            student_value=actual_months, required_value=required_months, operator=operator,
        )

    status = "met" if result else "not_met"
    relation = "meets" if result else "does not meet"
    return make_result(
        rule, status,
        f"Student's work experience ({actual_months} months) {relation} the required experience ({operator} {required_months:g} months).",
        student_value=actual_months, required_value=required_months, operator=operator,
    )

def evaluate_entrance_exam(rule, student_data):
    """Evaluate the student's entrance examination records."""

    exams = student_data.get("entrance_exams")

    required_exam = str(
        rule.get("rule_value") or ""
    ).strip()

    if exams is None:
        return make_result(
            rule,
            "unknown",
            "No entrance exam records are available.",
            required_value=required_exam
        )

    for exam in exams:
        exam_name = str(
            exam.get("exam_name") or ""
        ).strip()

        if exam_name.lower() == required_exam.lower():
            return make_result(
                rule,
                "met",
                f"Verified {required_exam.upper()} exam record found.",
                student_value=exam_name,
                required_value=required_exam
            )

    return make_result(
        rule,
        "not_met",
        f"No {required_exam.upper()} exam record was found.",
        student_value="No matching exam record",
        required_value=required_exam
    )


def resolve_study_language(program_languages, preferred_study_language=None):
    """
    Resolve the student's intended study language.

    Rules:
        - One available language: select automatically.
        - Multiple languages: require student selection.
        - Invalid selection: raise ValueError.
    """
    if isinstance(program_languages, str):
        try:
            program_languages = json.loads(program_languages)
        except json.JSONDecodeError as exc:
            raise ValueError("Invalid program languages JSON.") from exc

    if not isinstance(program_languages, list) or not program_languages:
        raise ValueError(
            "No valid study languages are configured for this program."
        )

    # Remove empty values and duplicate languages.
    available_languages = list(dict.fromkeys(
        str(language).strip()
        for language in program_languages
        if language and str(language).strip()
    ))

    if not available_languages:
        raise ValueError("No valid study languages are available.")

    # Automatically select when only one language exists.
    if len(available_languages) == 1:
        return available_languages[0]

    # Multiple languages require a student selection.
    if not preferred_study_language:
        raise ValueError("Please select your preferred study language.")

    selected_language = str(preferred_study_language).strip()

    # Validate selection without case sensitivity.
    matched_language = next(
        (
            language
            for language in available_languages
            if language.lower() == selected_language.lower()
        ),
        None
    )

    if matched_language is None:
        raise ValueError(
            f"Unsupported study language: {selected_language}. "
            f"Available languages: {', '.join(available_languages)}"
        )

    return matched_language


def evaluate_eligibility_rules(
    student_data,
    rules,
    program_context=None,
    program_languages=None,
    preferred_study_language=None
):
    """
    Evaluate supported non-degree eligibility rules.

    program_languages:
        Languages stored in scholarship_programs.languages.
        Accepts either a Python list or JSON string.

    preferred_study_language:
        Student's selection when multiple languages are available.

    program_context:
        Additional program information.
    """
    if not isinstance(student_data, dict):
        raise ValueError("student_data must be a dictionary.")

    if not isinstance(rules, list):
        raise ValueError("rules must be a list.")

    profile = student_data.get("profile") or {}
    languages = student_data.get("languages") or []
    program_context = dict(program_context or {})

    scholarship_country = (
        program_context.get("country")
        or student_data.get("scholarship_country")
        )   

    # Resolve the language before evaluating conditional rules.
    if program_languages is not None:
        selected_language = resolve_study_language(
            program_languages,
            preferred_study_language
        )

        program_context["study_language"] = selected_language

        print("\nDEBUG STUDY LANGUAGE:")
        print("Program languages:", program_languages)
        print("Selected language:", selected_language)
        print("Program context:", program_context)

    def evaluate_language_rule(rule):
        language_context = str(
            rule.get("study_language")
            or program_context.get("study_language")
            or ""
        ).strip().casefold()

        if language_context in {"non-chinese", "non chinese", "english"}:
            return evaluate_english_proficiency(rule, student_data)

        return evaluate_language(rule, languages)

    evaluators = {
        "age": lambda rule: evaluate_age(rule, profile),
        "minimum_age": lambda rule: evaluate_age(rule, profile),
        "maximum_age": lambda rule: evaluate_age(rule, profile),

        "citizenship": lambda rule: evaluate_citizenship(
            rule, profile, scholarship_country
        ),

        "nationality": lambda rule: evaluate_citizenship(
            rule, profile, scholarship_country
        ),

        "health": lambda rule: evaluate_health_certificate(
            rule, student_data
        ),

        "criminal_record": lambda rule: evaluate_criminal_record(
            rule, student_data
        ),
        "criminal_record_certificate": lambda rule: evaluate_criminal_record(
            rule, student_data
        ),
        "police_clearance": lambda rule: evaluate_criminal_record(
            rule, student_data
        ),

        # Existing generic language matcher remains independent from
        # direct named-test score comparisons below.
        "language_proficiency": evaluate_language_rule,

        "ielts": lambda rule: evaluate_test_score(rule, languages),
        "toefl": lambda rule: evaluate_test_score(rule, languages),
        "duolingo": lambda rule: evaluate_test_score(rule, languages),
        "pte": lambda rule: evaluate_test_score(rule, languages),

        "work-experience": lambda rule: evaluate_work_experience(
            rule, profile
        ),

        "entrance_exam": lambda rule: evaluate_entrance_exam(
            rule, student_data
        ),
    }

    results = []

    for rule in rules:
        rule_type = _normalize_rule_type(rule.get("rule_type"))

        if rule_type not in evaluators:
            continue

        condition_result = evaluate_condition(
            rule,
            program_context
        )

        if condition_result is False:
            results.append(
                make_result(
                    rule,
                    "not_applicable",
                    "The rule's program condition is not satisfied."
                )
            )
            continue

        if condition_result is None:
            results.append(
                make_result(
                    rule,
                    "unknown",
                    "The program information required to evaluate "
                    "this conditional rule is missing."
                )
            )
            continue

        results.append(evaluators[rule_type](rule))

    return results
