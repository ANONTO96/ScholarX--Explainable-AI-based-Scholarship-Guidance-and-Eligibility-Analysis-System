# from .age import extract_age
# from .degree import extract_degree
# from .citizenship import extract_citizenship
# from .health import extract_health
# from .language import extract_language
# from .exam import extract_exam


# def detect_program(sentence):

#     text = sentence.lower()

#     if "undergraduate" in text or "bachelor program" in text:
#         return "Undergraduate"

#     if "master" in text:
#         return "Master"

#     if "doctoral" in text or "phd" in text:
#         return "Doctoral"

#     if "general scholar" in text:
#         return "General Scholar"

#     if "senior scholar" in text:
#         return "Senior Scholar"

#     return None


# def extract_eligibility(sentences):

#     scholarship_rules = []
#     program_rules = {}

#     for sentence in sentences:

#         program = detect_program(sentence)

#         rules = []

#         rules.extend(extract_age(sentence))
#         rules.extend(extract_degree(sentence))
#         rules.extend(extract_citizenship(sentence))
#         rules.extend(extract_health(sentence))
#         rules.extend(extract_language(sentence))
#         rules.extend(extract_exam(sentence))

#         if not rules:
#             continue

#         # Program-specific rules
#         if program:

#             if program not in program_rules:
#                 program_rules[program] = []

#             program_rules[program].extend(rules)

#         # Scholarship-wide rules
#         else:

#             scholarship_rules.extend(rules)

#     formatted_program_rules = []

#     for program, rules in program_rules.items():

#         formatted_program_rules.append({
#             "program": program,
#             "rules": rules
#         })

#     return {
#         "scholarship_rules": scholarship_rules,
#         "program_rules": formatted_program_rules
#     }


from .age import extract_age
from .degree import extract_degree
from .citizenship import extract_citizenship
from .health import extract_health
from .language import extract_language
from .exam import extract_exam


PROGRAMS = [
    "Undergraduate",
    "Master",
    "Doctoral",
    "General Scholar",
    "Senior Scholar"
]


def detect_programs(sentence):

    text = sentence.lower()

    programs = []

    if "undergraduate" in text or "bachelor program" in text or "bachelor programs" in text:
        programs.append("Undergraduate")

    if "master" in text or "master's" in text:
        programs.append("Master")

    if "doctoral" in text or "doctor" in text or "phd" in text:
        programs.append("Doctoral")

    if "general scholar" in text:
        programs.append("General Scholar")

    if "senior scholar" in text:
        programs.append("Senior Scholar")

    return programs

def is_program_heading(sentence):

    text = sentence.strip().lower()

    for program in PROGRAMS:

        if text == program.lower():
            return program

    return None


def extract_eligibility(sentences):

    scholarship_rules = []
    program_rules = {}

    for sentence in sentences:

        sentence = sentence.strip()

        if not sentence:
            continue

        # Detect all programs mentioned in this sentence
        programs = detect_programs(sentence)

        rules = []

        rules.extend(extract_age(sentence))
        rules.extend(extract_degree(sentence))
        rules.extend(extract_citizenship(sentence))
        rules.extend(extract_health(sentence))
        rules.extend(extract_language(sentence))
        rules.extend(extract_exam(sentence))

        if not rules:
            continue

        # -----------------------------------------
        # Scholarship-wide rules
        # -----------------------------------------

        if not programs:
            scholarship_rules.extend(rules)
            continue

        # -----------------------------------------
        # Program-specific rules
        # -----------------------------------------

        for program in programs:

            if program not in program_rules:
                program_rules[program] = []

            program_rules[program].extend(rules)

    # -----------------------------------------
    # Format program rules
    # -----------------------------------------

    formatted_program_rules = []

    for program, rules in program_rules.items():

        formatted_program_rules.append({
            "program": program,
            "rules": rules
        })

    return {
        "scholarship_rules": scholarship_rules,
        "program_rules": formatted_program_rules
    }