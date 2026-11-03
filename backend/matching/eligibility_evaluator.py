"""
Eligibility evaluator for ScholarX.

Currently supports:
- age
- citizenship
- health certificate checklist
- language_proficiency (English evidence, IELTS, and HSK)
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


def evaluate_health_certificate(rule, student_data):
    documents = student_data.get("documents_by_checklist_id", {})
    document = documents.get("health-certificate")
    required_health = rule.get("rule_value")

    if document is None:
        return make_result(
            rule,
            "unknown",
            "Health certificate information is unavailable.",
            required_value=required_health
        )

    if document.get("has_document"):
        return make_result(
            rule,
            "met",
            "Student has marked the health certificate as available.",
            student_value="Available",
            required_value=required_health
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

    documents = student_data.get("documents_by_checklist_id", {})
    languages = student_data.get("languages") or []

    required_value = rule.get("rule_value")

    # -----------------------------------------------------
    # 1. Check English certificate availability
    # -----------------------------------------------------

    english_document = documents.get("english-test")

    certificate_available = (
        english_document.get("has_document")
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


def evaluate_citizenship(rule, profile, scholarship_country):
    """Evaluate citizenship requirements against the scholarship host country."""

    nationality = profile.get("nationality")
    rule_value = str(rule.get("rule_value") or "").strip()

    if not nationality:
        return make_result(
            rule,
            "unknown",
            "Student nationality is not available in the profile.",
            required_value=rule_value,
        )

    if not scholarship_country:
        return make_result(
            rule,
            "unknown",
            "Scholarship host country is not available.",
            student_value=nationality,
            required_value=rule_value,
        )

    student_country = normalize_country_name(nationality)
    host_country = normalize_country_name(scholarship_country)

    if not student_country or not host_country:
        return make_result(
            rule,
            "unknown",
            "Unable to normalize the student nationality or scholarship country.",
            student_value=nationality,
            required_value=rule_value,
            comparison_value=scholarship_country,
        )

    if not rule_value:
        return make_result(
            rule,
            "unknown",
            "Citizenship requirement is not specified.",
            student_value=nationality,
            comparison_value=scholarship_country,
        )

    required_text = rule_value.casefold()

    # Generic international-student requirement.
    if required_text in {"international", "international student"}:
        eligible = student_country != host_country
        comparison_operator = "!="

        reason = (
            f"The applicant's nationality ({nationality}) "
            f"{'differs from' if eligible else 'matches'} "
            f"the scholarship host country ({scholarship_country})."
        )

        if eligible:
            reason += " The international-student requirement is satisfied."
        else:
            reason += " The applicant does not satisfy the international-student requirement."

    else:
        # Specific citizenship requirement, including negative requirements.
        is_negative = required_text.startswith(("non-", "non "))

        country_descriptor = (
            re.sub(r"^non[- ]", "", required_text)
            if is_negative
            else required_text
        )

        required_country = get_country_from_rule(country_descriptor)

        if not required_country:
            return make_result(
                rule,
                "unknown",
                f"Unable to identify the country in the citizenship requirement: {rule_value}.",
                student_value=nationality,
                required_value=rule_value,
                comparison_value=scholarship_country,
            )

        if required_country != host_country:
            return make_result(
                rule,
                "unknown",
                "The country specified in the citizenship requirement "
                "does not match the scholarship host country.",
                student_value=nationality,
                required_value=rule_value,
                comparison_value=scholarship_country,
            )

        if is_negative:
            eligible = student_country != required_country
            comparison_operator = "!="
        else:
            eligible = student_country == required_country
            comparison_operator = "="

        reason = (
            f"The applicant's nationality ({nationality}) "
            f"{'satisfies' if eligible else 'does not satisfy'} "
            f"the citizenship requirement ({rule_value}) "
            f"for {scholarship_country}."
        )

    return make_result(
        rule,
        "met" if eligible else "not_met",
        reason,
        student_value=nationality,
        required_value=rule_value,
        operator=rule.get("operator"),
        comparison_value=scholarship_country,
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
            "The required language proficiency is not configured."
        )

    normalized_required = required.lower()

    if normalized_required == "university admission requirements":
        return make_result(
            rule,
            "unknown",
            "University-specific language admission requirements "
            "have not been configured."
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
            f"Unsupported language requirement: {required}"
        )

    if not languages:
        return make_result(
            rule,
            "unknown",
            "No language proficiency records are available."
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
            f"No {test_type.upper()} test record was found."
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
                    f"satisfies the {operator} {expected_score} requirement."
                )

            return make_result(
                rule,
                "met",
                f"Valid HSK level {result['level']} "
                f"satisfies the HSK {expected_level} requirement."
            )

    # If another record could change the result, do not claim failure.
    if unknown_records:
        return make_result(
            rule,
            "unknown",
            "A matching language test record exists, but its score "
            "or validity cannot be verified."
        )

    if not valid_results and expired_records:
        return make_result(
            rule,
            "unknown",
            "Matching language test records were found, but all "
            "available records have expired."
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
                f"does not satisfy the {operator} {expected_score} requirement."
            )

        best_level = max(
            result["level"]
            for result in valid_results
        )

        return make_result(
            rule,
            "not_met",
            f"Best valid HSK level ({best_level}) "
            f"does not satisfy HSK {expected_level}."
        )

    return make_result(
        rule,
        "unknown",
        "Unable to verify the language proficiency requirement."
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

    evaluators = {
        "age": lambda rule: evaluate_age(rule, profile),
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

        "language_proficiency": lambda rule: (
            evaluate_english_proficiency(rule, student_data)
            if str(rule.get("study_language") or "").strip().lower()
               == "non-chinese"
            else evaluate_language(rule, languages)
        ),

        "entrance_exam": lambda rule: evaluate_entrance_exam(
            rule, student_data
        ),
    }

    results = []

    for rule in rules:
        rule_type = rule.get("rule_type")

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
