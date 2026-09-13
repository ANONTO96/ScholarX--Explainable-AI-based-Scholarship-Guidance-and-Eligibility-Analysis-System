import re


def extract_documents(sentences):

    documents = []

    for sentence in sentences:

        sentence = sentence.strip()

        if not sentence:
            continue

        document = extract_document(sentence)

        if document:
            documents.append(document)

    return documents


def extract_document(sentence):

    text = sentence.strip()

    # --------------------------------------------------
    # Application Form
    # --------------------------------------------------

    if re.search(
        r"application form for chinese government scholarship",
        text,
        re.I
    ):
        return {
            "document_name": "Application Form for Chinese Government Scholarship",
            "requirement": "Filled in online",
            "condition_text": None,
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Passport
    # --------------------------------------------------

    if re.search(
        r"ordinary passport|passport",
        text,
        re.I
    ):
        return {
            "document_name": "Ordinary Passport",
            "requirement": extract_passport_requirement(text),
            "condition_text": extract_condition(text),
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Diploma / Highest Education
    # --------------------------------------------------

    if re.search(
        r"diploma|highest education|certificate of expected graduation|student status",
        text,
        re.I
    ):
        return {
            "document_name": "Diploma and Highest Education Certificate",
            "requirement": text,
            "condition_text": None,
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Academic Records
    # --------------------------------------------------

    if re.search(
        r"academic records|academic record",
        text,
        re.I
    ):
        return {
            "document_name": "Academic Records",
            "requirement": text,
            "condition_text": None,
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Language Qualification
    # --------------------------------------------------

    if re.search(
        r"language qualification certificates|language proficiency certificates",
        text,
        re.I
    ):
        return {
            "document_name": "Language Qualification Certificates",
            "requirement": text,
            "condition_text": extract_condition(text),
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # CSCA
    # --------------------------------------------------

    if re.search(
        r"csca score report",
        text,
        re.I
    ):
        return {
            "document_name": "CSCA Score Report",
            "requirement": text,
            "condition_text": "Applicants seeking to pursue a bachelor's degree",
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Pre-Admission
    # --------------------------------------------------

    if re.search(
        r"pre-admission documents|pre-admission notice|invitation letter",
        text,
        re.I
    ):
        return {
            "document_name": "Pre-Admission Documents",
            "requirement": text,
            "condition_text": "All applicants",
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Study / Research Plan
    # --------------------------------------------------

    if re.search(
        r"study or research plan|study.*research plan",
        text,
        re.I
    ):
        return {
            "document_name": "Study or Research Plan",
            "requirement": text,
            "condition_text": None,
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Recommendation Letters
    # --------------------------------------------------

    if re.search(
        r"recommendation letters|recommendation letter",
        text,
        re.I
    ):
        return {
            "document_name": "Recommendation Letters",
            "requirement": text,
            "condition_text": extract_condition(text),
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Works / Portfolio
    # --------------------------------------------------

    if re.search(
        r"own works|videos and paintings|arts or design",
        text,
        re.I
    ):
        return {
            "document_name": "Portfolio / Own Works",
            "requirement": text,
            "condition_text": "Applicants for arts or design programs",
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Legal Guardian Documents
    # --------------------------------------------------

    if re.search(
        r"legal guardian|guardian\(s\)",
        text,
        re.I
    ):
        return {
            "document_name": "Legal Guardian Documents",
            "requirement": text,
            "condition_text": "Applicants under the age of 18",
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Physical Examination Form
    # --------------------------------------------------

    if re.search(
        r"foreigner physical examination form|physical examination form",
        text,
        re.I
    ):
        return {
            "document_name": "Foreigner Physical Examination Form",
            "requirement": text,
            "condition_text": "Applicants studying in China for more than six months",
            "mandatory": True,
            "source_sentence": text
        }

    # --------------------------------------------------
    # Non-Criminal Record
    # --------------------------------------------------

    if re.search(
        r"non-criminal record|police clearance certificate",
        text,
        re.I
    ):
        return {
            "document_name": "Certificate of Non-Criminal Record",
            "requirement": text,
            "condition_text": None,
            "mandatory": True,
            "source_sentence": text
        }

    return None


# ======================================================
# Helper Functions
# ======================================================

def extract_passport_requirement(text):

    if re.search(
        r"validity.*less than 12 months",
        text,
        re.I
    ):
        return (
            "Submit a clear scanned copy of the information page "
            "of the ordinary passport. The passport should have "
            "at least 12 months validity from the expected start date."
        )

    return "Submit a clear scanned copy of the information page of the ordinary passport."


def extract_condition(text):

    conditions = []

    if re.search(r"master|doctoral|general scholar|senior scholar", text, re.I):
        conditions.append(
            "Master's, doctoral, general scholar, or senior scholar program"
        )

    if re.search(r"bachelor|undergraduate", text, re.I):
        conditions.append(
            "Bachelor's / undergraduate program"
        )

    if re.search(r"under the age of 18", text, re.I):
        conditions.append(
            "Applicants under the age of 18"
        )

    if re.search(r"more than six months", text, re.I):
        conditions.append(
            "Study duration more than six months"
        )

    if re.search(r"arts or design", text, re.I):
        conditions.append(
            "Arts or design program"
        )

    if conditions:
        return "; ".join(conditions)

    return None