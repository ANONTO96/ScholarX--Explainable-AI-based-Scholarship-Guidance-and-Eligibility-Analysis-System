
import re
from typing import Any, Dict, List, Optional


# ============================================================
# 1. DOCUMENT CHECKLIST IDs
# ============================================================

DOCUMENT_IDS = {
    "passport": "passport-doc",
    "nid": "nid-doc",
    "health": "health-doc",
    "transcript": "transcript-doc",
    "certificate": "certificate-doc",
    "cv": "cv-doc",
    "study_plan": "study-plan-doc",
    "recommendation": "recommendation-doc",
    "moi": "moi-doc",
    "proof_of_fund": "pof-doc",
    "research": "research-doc",
    "pcc": "pcc-doc",
    "portfolio": "portfolio-doc",
    "application_form": "application-form-doc",
    "other": "other-doc",
}


# ============================================================
# 2. REGEX PATTERNS
# ============================================================

LANGUAGE_EXAM_PATTERN = re.compile(
    r"\b("
    r"IELTS|TOEFL|TOEIC|Duolingo|PTE|"
    r"Cambridge\s+English|HSK|JLPT|TOPIK"
    r")\b",
    re.IGNORECASE,
)

LANGUAGE_CERTIFICATE_PATTERN = re.compile(
    r"\blanguage\s+"
    r"(?:qualification|proficiency)\s+certificates?\b"
    r"|\blanguage\s+certificates?\b"
    r"|\blanguage\s+qualification\b"
    r"|\blanguage\s+proficiency\b"
    r"|\bEnglish\s+proficiency\s+certificates?\b"
    r"|\bmedium\s+of\s+instruction\b",
    re.IGNORECASE,
)

OPTIONAL_PATTERN = re.compile(
    r"\b("
    r"optional|"
    r"not\s+required|"
    r"not\s+mandatory|"
    r"if\s+available|"
    r"if\s+applicable|"
    r"where\s+available|"
    r"if\s+you\s+wish|"
    r"at\s+the\s+applicant'?s\s+discretion"
    r")\b"
    r"|\bmay\s+(?:submit|provide|upload)\b"
    r"|\bcan\s+(?:submit|provide|upload)\b",
    re.IGNORECASE,
)

MANDATORY_PATTERN = re.compile(
    r"\b("
    r"must|"
    r"shall|"
    r"required|"
    r"compulsory|"
    r"mandatory|"
    r"needs?\s+to|"
    r"are\s+to|"
    r"is\s+to"
    r")\b"
    r"|\bsubmit\b"
    r"|\bprovide\b"
    r"|\battach\b"
    r"|\binclude\b",
    re.IGNORECASE,
)

DOCUMENT_KEYWORD_PATTERN = re.compile(
    r"\b("
    r"document|"
    r"certificate|"
    r"letter|"
    r"form|"
    r"record|"
    r"statement|"
    r"proof|"
    r"copy|"
    r"photograph|"
    r"photo|"
    r"passport|"
    r"transcript|"
    r"proposal|"
    r"portfolio|"
    r"declaration|"
    r"permit|"
    r"license|"
    r"licence|"
    r"contract|"
    r"application"
    r")\b",
    re.IGNORECASE,
)


# ============================================================
# 3. TEXT NORMALIZATION
# ============================================================

def normalize_text(text: str) -> str:
    """
    Normalize whitespace and remove unnecessary separators.
    """

    if not text:
        return ""

    text = text.replace("\xa0", " ")
    text = re.sub(r"\s+", " ", text)

    return text.strip(" \t\n\r;,-")


def clean_source_line(text: str) -> str:
    """
    Clean an individual source sentence without changing
    its original meaning.
    """

    text = normalize_text(text)

    # Remove numbering such as 1. or 5.
    text = re.sub(r"^\d+[\.)]\s*", "", text)

    # Remove repeated separator characters.
    text = re.sub(r"[-_=]{3,}", "", text)

    return text.strip(" ;,-")


# ============================================================
# 4. MANDATORY REQUIREMENT DETECTION
# ============================================================

def is_mandatory_requirement(text: str) -> bool:
    """
    Determine whether the source sentence explicitly
    indicates a mandatory requirement.

    Optional wording takes priority.
    """

    if not text:
        return False

    text = normalize_text(text)

    if OPTIONAL_PATTERN.search(text):
        return False

    if MANDATORY_PATTERN.search(text):
        return True

    return False


# ============================================================
# 5. DOCUMENT CREATION
# ============================================================

def create_document(
    document_name: str,
    requirement: str,
    mandatory: bool = False,
) -> Dict[str, Any]:

    return {
        "document_name": document_name,
        "requirement": requirement,
        "condition_text": "=",
        "mandatory": mandatory,
        "source_sentence": requirement,
    }


# ============================================================
# 6. DOCUMENT CLASSIFICATION
# ============================================================

def extract_document(sentence: str) -> Optional[Dict[str, Any]]:
    """
    Identify the document category from one source sentence.

    Returns None when the sentence is not a document
    requirement or is an exam-specific language reference.
    """

    text = normalize_text(sentence)

    if not text:
        return None

    mandatory = is_mandatory_requirement(text)

    # --------------------------------------------------------
    # A. Language proficiency certificate
    # --------------------------------------------------------

    # This check MUST happen before the language exam filter.
    # Otherwise, sentences mentioning IELTS/TOEFL are skipped.

    if LANGUAGE_CERTIFICATE_PATTERN.search(text):
        return create_document(
            DOCUMENT_IDS["moi"],
            text,
            mandatory,
        )

    # Skip standalone language exam references.
    if LANGUAGE_EXAM_PATTERN.search(text):
        return None

    # --------------------------------------------------------
    # B. Pre-admission documents and application form
    # --------------------------------------------------------

    if re.search(
        r"\bpre[- ]admission\b"
        r"|\binvitation\s+letter\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["application_form"],
            text,
            mandatory,
        )

    if re.search(
        r"\bapplication\s+form\b"
        r"|\bonline\s+application\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["application_form"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # C. Passport
    # --------------------------------------------------------

    if re.search(
        r"\bordinary\s+passports?\b|\bpassports?\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["passport"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # D. National identity
    # --------------------------------------------------------

    if re.search(
        r"\bNID\b"
        r"|\bnational\s+identity\b"
        r"|\bidentity\s+card\b"
        r"|\bnationality\s+proof\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["nid"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # E. Health certificate
    # --------------------------------------------------------

    if re.search(
        r"\bhealth\s+certificate\b"
        r"|\bmedical\s+certificate\b"
        r"|\bphysical\s+examination\b"
        r"|\bmedical\s+examination\b"
        r"|\bhealth\s+examination\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["health"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # F. Academic transcript
    # --------------------------------------------------------

    if re.search(
        r"\btranscripts?\b"
        r"|\bacademic\s+records?\b"
        r"|\bacademic\s+results?\b"
        r"|\bgrade\s+reports?\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["transcript"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # G. Degree / certificate
    # --------------------------------------------------------

    if re.search(
        r"\bdegree\s+certificates?\b"
        r"|\bdiplomas?\b"
        r"|\bgraduation\s+certificates?\b"
        r"|\bexpected\s+graduation\b"
        r"|\bstudent\s+status\s+certificates?\b"
        r"|\bhighest\s+education\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["certificate"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # H. CV / Resume
    # --------------------------------------------------------

    if re.search(
        r"\bCV\b"
        r"|\bresume\b"
        r"|\bcurriculum\s+vitae\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["cv"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # I. Study plan
    # --------------------------------------------------------

    if re.search(
        r"\bstudy\s+plan\b"
        r"|\bstudy\s+proposal\b"
        r"|\bresearch\s+plan\b"
        r"|\bpersonal\s+statement\b"
        r"|\bmotivation\s+letter\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["study_plan"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # J. Recommendation letter
    # --------------------------------------------------------

    if re.search(
        r"\brecommendation\s+letters?\b"
        r"|\breference\s+letters?\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["recommendation"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # K. Proof of funds
    # --------------------------------------------------------

    if re.search(
        r"\bproof\s+of\s+funds?\b"
        r"|\bfinancial\s+statements?\b"
        r"|\bbank\s+statements?\b"
        r"|\bbank\s+certificates?\b"
        r"|\bfinancial\s+proof\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["proof_of_fund"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # L. Research proposal
    # --------------------------------------------------------

    if re.search(
        r"\bresearch\s+proposals?\b"
        r"|\bdoctoral\s+research\s+proposals?\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["research"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # M. Police clearance
    # --------------------------------------------------------

    if re.search(
        r"\bpolice\s+clearance\b"
        r"|\bcertificate\s+of\s+non[- ]criminal\s+record\b"
        r"|\bnon[- ]criminal\s+record\b"
        r"|\bcriminal\s+record\s+certificate\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["pcc"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # N. Portfolio
    # --------------------------------------------------------

    if re.search(
        r"\bportfolio\b"
        r"|\bsamples?\s+of\s+(?:their|his|her|your)\s+work\b"
        r"|\bown\s+works\b",
        text,
        re.IGNORECASE,
    ):
        return create_document(
            DOCUMENT_IDS["portfolio"],
            text,
            mandatory,
        )

    # --------------------------------------------------------
    # O. Unknown document reference
    # --------------------------------------------------------

    if DOCUMENT_KEYWORD_PATTERN.search(text):
        return create_document(
            DOCUMENT_IDS["other"],
            text,
            False,
        )

    return None


# ============================================================
# 7. CONCISE SOURCE TEXT SELECTION
# ============================================================

def source_line_priority(text: str) -> int:
    """
    Give higher priority to sentences containing explicit
    requirements and important conditions.
    """

    score = 0

    if is_mandatory_requirement(text):
        score += 5

    if re.search(
        r"\b(if|when|where|for applicants|applicants for|"
        r"more than|less than|at least|within|according to)\b",
        text,
        re.IGNORECASE,
    ):
        score += 2

    if DOCUMENT_KEYWORD_PATTERN.search(text):
        score += 1

    return score


def select_important_source_lines(
    source_sentences: List[str],
    max_lines: int = 3,
) -> List[str]:
    """
    Select up to three useful source lines.

    Priority:
    1. Explicit mandatory requirements.
    2. Important applicant conditions.
    3. Supporting document details.

    Original source order is preserved in the final result.
    """

    cleaned_lines = []
    seen = set()

    for sentence in source_sentences:

        line = clean_source_line(sentence)

        if not line:
            continue

        normalized = line.lower()

        if normalized in seen:
            continue

        seen.add(normalized)
        cleaned_lines.append(line)

    if len(cleaned_lines) <= max_lines:
        return cleaned_lines

    ranked = sorted(
        enumerate(cleaned_lines),
        key=lambda item: (
            source_line_priority(item[1]),
            -item[0],
        ),
        reverse=True,
    )

    selected_indices = {
        index
        for index, _ in ranked[:max_lines]
    }

    return [
        line
        for index, line in enumerate(cleaned_lines)
        if index in selected_indices
    ]


# ============================================================
# 8. GROUP DOCUMENTS
# ============================================================

def extract_documents(
    sentences: List[str],
) -> List[Dict[str, Any]]:
    """
    Extract documents from source sentences.

    Guarantees:
    - One record per document_name.
    - One consolidated requirement value.
    - condition_text is always "=".
    - source_sentence contains up to three important lines.
    - mandatory is True if any applicable sentence explicitly
      requires the document.
    """

    grouped_documents: Dict[str, Dict[str, Any]] = {}

    for sentence in sentences:

        result = extract_document(sentence)

        if result is None:
            continue

        document_name = result["document_name"]

        if document_name not in grouped_documents:

            grouped_documents[document_name] = {
                "document_name": document_name,
                "source_sentences": [],
                "mandatory": False,
            }

        group = grouped_documents[document_name]

        # Preserve unique source sentences for consolidation.
        source = clean_source_line(sentence)

        if (
            source
            and source not in group["source_sentences"]
        ):
            group["source_sentences"].append(source)

        # Any explicitly mandatory applicable sentence
        # makes the consolidated document mandatory.
        if result["mandatory"]:
            group["mandatory"] = True

    # --------------------------------------------------------
    # Build final consolidated records
    # --------------------------------------------------------

    final_documents = []

    for document_name, group in grouped_documents.items():

        important_lines = select_important_source_lines(
            group["source_sentences"],
            max_lines=3,
        )

        if not important_lines:
            continue

        requirement = "; ".join(important_lines)

        source_sentence = "\n".join(important_lines)

        final_documents.append({
        "document_name": document_name,
        "requirement": requirement,
        "condition_text": "=" if group["mandatory"] else "!=",
        "mandatory": group["mandatory"],
        "source_sentence": source_sentence,
        })

    return final_documents


# ============================================================
# 9. DATABASE INSERTION / UPDATE
# ============================================================

def insert_scholarship_documents(
    cursor,
    scholarship_id: int,
    documents: List[Dict[str, Any]],
) -> None:
    """
    Insert or update extracted scholarship documents.

    Uses the existing unique key:
        (scholarship_id, document_name)

    Does not require a new database index.
    """

    query = """
        INSERT INTO scholarship_documents (
            scholarship_id,
            document_name,
            requirement,
            condition_text,
            mandatory,
            source_sentence
        )
        VALUES (%s, %s, %s, %s, %s, %s)

        ON DUPLICATE KEY UPDATE
            requirement = VALUES(requirement),
            condition_text = '=',
            mandatory = VALUES(mandatory),
            source_sentence = VALUES(source_sentence)
    """

    for document in documents:

        cursor.execute(
            query,
            (
                scholarship_id,
                document["document_name"],
                document["requirement"],
                "=",
                document["mandatory"],
                document["source_sentence"],
            ),
        )
