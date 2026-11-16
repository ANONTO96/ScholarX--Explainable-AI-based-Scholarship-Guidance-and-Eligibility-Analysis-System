from .age import extract_age
from .degree import extract_degree
from .citizenship import extract_citizenship
from .health import extract_health
from .language import extract_language
from .exam import extract_exam
from .gpa import extract_gpa
from .criminal_record import extract_criminal_record

SUPPORTED_PROGRAMS = ["Undergraduate", "Master", "Doctoral"]

PROGRAM_PATTERNS = {
    "Undergraduate": r"\bundergraduate\b|\bbachelor(?:'s|’s)?\s+programs?\b|\bbachelor\s+programs?\b",
    "Master": r"\bmaster(?:'s|’s)?(?:\s+or)?\s+programs?\b|\bmaster\s+programs?\b",
    "Doctoral": r"\bdoctoral\s+programs?\b|\bphd\s+programs?\b|\bdoctorate\s+programs?\b",
}


def detect_programs(sentence):
    import re
    return [
        name for name, pattern in PROGRAM_PATTERNS.items()
        if re.search(pattern, sentence, re.IGNORECASE)
    ]


def _clean_source_sentence(sentence):
    """Remove only leading list numbering; preserve numbers in the requirement."""
    import re

    cleaned = (sentence or "").strip()
    # Examples removed: "1. ", "2) ", "(3) ". The required whitespace
    # prevents stripping decimals such as "1.5 GPA" or values like "HSK 4".
    marker = r"^(?:\(\d+\)|\d+[.)])\s+"
    while re.match(marker, cleaned):
        cleaned = re.sub(marker, "", cleaned, count=1)
    return cleaned.strip()


def _clean_rule_source(rule):
    """Normalize source_sentence without changing extracted rule values."""
    if rule.get("source_sentence"):
        rule["source_sentence"] = _clean_source_sentence(rule["source_sentence"])
    return rule


def _append_unique(target, rule):
    _clean_rule_source(rule)
    if rule not in target:
        target.append(rule)


def _route_rules(sentences, scholarship_rules, program_rules):
    """Run eligibility-section rule extractors and assign their scope."""
    import re

    extractors = (
        extract_age,
        extract_degree,
        extract_citizenship,
        extract_health,
        extract_language,
        extract_exam,
        extract_gpa,
    )

    for sentence in sentences or []:
        sentence = sentence.strip()
        if not sentence:
            continue

        detected_programs = detect_programs(sentence)
        for extractor in extractors:
            for original_rule in extractor(sentence):
                rule = original_rule.copy()
                explicit_program = rule.pop("program", None)
                explicit_programs = rule.pop("programs", None)

                if explicit_program:
                    targets = [explicit_program]
                elif explicit_programs is not None:
                    targets = explicit_programs
                else:
                    targets = detected_programs

                targets = [p for p in targets if p in SUPPORTED_PROGRAMS]
                if not targets:
                    # An explicit, non-program-specific requirement is scholarship scope.
                    _append_unique(scholarship_rules, rule)
                    continue

                for program in targets:
                    _append_unique(program_rules[program], rule.copy())


def extract_eligibility(eligibility_sentences, document_sentences=None):
    """
    Extract Level 3 eligibility rules.

    eligibility_sentences:
        Sentences from the Eligibility section. All existing eligibility
        extractors run against these sentences.

    document_sentences:
        Sentences from the Application Documents section. Only the
        criminal-record/PCC evidence extractor runs against these sentences.
        The separate Level 1 document extractor and its output are untouched.

    The one-argument call remains supported for compatibility with older callers.
    """
    scholarship_rules = []
    program_rules = {program: [] for program in SUPPORTED_PROGRAMS}

    if isinstance(eligibility_sentences, str):
        eligibility_sentences = [eligibility_sentences]
    if isinstance(document_sentences, str):
        document_sentences = [document_sentences]

    _route_rules(eligibility_sentences, scholarship_rules, program_rules)

    # The document section is consulted only for the PCC/non-criminal-record
    # eligibility condition. Other document names do not create eligibility rules.
    for sentence in document_sentences or []:
        sentence = sentence.strip()
        if not sentence:
            continue
        for rule in extract_criminal_record(sentence):
            _append_unique(scholarship_rules, rule)

    # Ensure a minimum_gpa rule always exists.
    all_rules = scholarship_rules + [
        rule
        for program_data in program_rules.values()
        for rule in program_data
    ]

    if not any(rule["rule_type"] == "minimum_gpa" for rule in all_rules):
        scholarship_rules.append({
            "rule_type": "minimum_gpa",
            "operator": ">=",
            "rule_value": 0,
            "category": "academic",
            "mandatory": False,
            "source_sentence": None,
        })

    return {
        "scholarship_rules": scholarship_rules,
        "program_rules": [
            {"program": program, "rules": program_rules[program]}
            for program in SUPPORTED_PROGRAMS if program_rules[program]
        ],
    }
