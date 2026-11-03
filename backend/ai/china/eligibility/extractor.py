import re

from .age import extract_age
from .degree import extract_degree
from .citizenship import extract_citizenship
from .health import extract_health
from .language import extract_language
from .exam import extract_exam

SUPPORTED_PROGRAMS = ["Undergraduate", "Master", "Doctoral"]

PROGRAM_PATTERNS = {
    "Undergraduate": r"\bundergraduate\b|\bbachelor(?:'s|’s)?\s+programs?\b",
    "Master": r"\bmaster(?:'s|’s)?\s+programs?\b",
    "Doctoral": r"\bdoctoral\s+programs?\b|\bphd\s+programs?\b",
}


def detect_programs(sentence):
    return [name for name, pattern in PROGRAM_PATTERNS.items()
            if re.search(pattern, sentence, re.IGNORECASE)]


def _append_unique(target, rule):
    if rule not in target:
        target.append(rule)


def extract_eligibility(sentences):
    scholarship_rules = []
    program_rules = {program: [] for program in SUPPORTED_PROGRAMS}

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        detected_programs = detect_programs(sentence)
        extracted = []
        for extractor in (extract_age, extract_degree, extract_citizenship,
                          extract_health, extract_language, extract_exam):
            extracted.extend(extractor(sentence))

        for original_rule in extracted:
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
                # Only genuinely unconditional rules belong at scholarship scope.
                _append_unique(scholarship_rules, rule)
                continue

            for program in targets:
                _append_unique(program_rules[program], rule.copy())

    return {
        "scholarship_rules": scholarship_rules,
        "program_rules": [
            {"program": program, "rules": program_rules[program]}
            for program in SUPPORTED_PROGRAMS if program_rules[program]
        ],
    }
