import os
import sys
import json


# ============================================================
# PROJECT PATH SETUP
# ============================================================

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

sys.path.insert(0, BASE_DIR)


# ============================================================
# DATABASE WRITERS
# ============================================================

from ai.common.database_writter.program_writer import insert_programs
from ai.common.database_writter.eligibility_writer import insert_eligibility
from ai.common.database_writter.document_writer import insert_documents
from ai.common.database_writter.coverage_writer import insert_coverage
from ai.common.database_writter.contact_writer import insert_contact


# ============================================================
# CHINA EXTRACTORS
# ============================================================

from ai.china.program.extract_program_name import program_name
from ai.china.program.extract_language import extract_languages
from ai.china.program.merge import merge_programs

from ai.china.eligibility.extractor import extract_eligibility
from ai.china.documents.extractor import extract_documents
from ai.china.coverage.extraction import extract_coverage
from ai.china.contact.extractor import extract_contact


# ============================================================
# COMMON PIPELINE UTILITIES
# ============================================================

from ai.pipeline.cleaner import clean_text
from ai.common.build_text import build_text
from ai.common.sentence_splitter import split_sentences


# ============================================================
# DATABASE QUERIES
# ============================================================

from database.queries.scholarship_queries import (
    get_sections_by_scholarship_id
)

from database.queries.id_by_countries import (
    get_id_by_country
)


# ============================================================
# OUTPUT FILE
# ============================================================

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

FILE_PATH = os.path.join(
    CURRENT_DIR,
    "extracted_rule.json"
)


# ============================================================
# MAIN EXTRACTION PIPELINE
# ============================================================

def run(country_name="china"):

    # ========================================================
    # 1. GET SCHOLARSHIP ID
    # ========================================================

    scholarship_response = get_id_by_country(country_name)

    if scholarship_response["status"] != 200:
        return scholarship_response

    scholarship_id = scholarship_response["data"]

    # print("=" * 70)
    # print(f"Scholarship Country : {country_name}")
    # print(f"Scholarship ID      : {scholarship_id}")
    # print("=" * 70)


    # ========================================================
    # 2. GET SCHOLARSHIP SECTIONS
    # ========================================================

    sections_response = get_sections_by_scholarship_id(
        scholarship_id
    )

    if sections_response["status"] != 200:
        return sections_response

    sections = sections_response["data"]

    # print("\nScholarship Sections:")
    # print(sections)


    # ========================================================
    # 3. PROGRAM & ELIGIBILITY TEXT
    # ========================================================

    requirement_text = build_text(
        sections,
        include_titles=[
            "Eligibility"
        ]
    )

    requirement_text = clean_text(
        requirement_text
    )

    eligibility_sentences = split_sentences(
        requirement_text
    )


    # ========================================================
    # 4. PROGRAM EXTRACTION
    # ========================================================

    programs = program_name(
        requirement_text
    )

    # Duration is currently manually assigned
    duration = {}

    languages = extract_languages(
        requirement_text
    )

    program_data = merge_programs(
        programs,
        duration,
        languages
    )

    # print("\nExtracted Programs:")
    # print(program_data)


    # ========================================================
    # 5. PROGRAM DATABASE INSERTION
    # ========================================================

    program_response = insert_programs(
        scholarship_id,
        program_data
    )

    print("\nProgram Database Response:")
    print(program_response)


    # ========================================================
    # 6. ELIGIBILITY EXTRACTION
    # ========================================================

    eligibility = extract_eligibility(
        eligibility_sentences
    )

    # print("\nExtracted Eligibility:")
    # print(eligibility)


    # ========================================================
    # 7. ELIGIBILITY DATABASE INSERTION
    # ========================================================

    eligibility_response = insert_eligibility(
        scholarship_id,
        eligibility
    )

    print("\nEligibility Database Response:")
    print(eligibility_response)


    # ========================================================
    # 8. REQUIRED DOCUMENT TEXT EXTRACTION
    # ========================================================

    document_text = build_text(
        sections,
        include_titles=[
            "Application Documents"
        ]
    )

    document_text = clean_text(
        document_text
    )

    document_sentences = split_sentences(
        document_text
    )


    # ========================================================
    # 9. REQUIRED DOCUMENT EXTRACTION
    # ========================================================

    documents = extract_documents(
        document_sentences
    )

    # print("\nExtracted Documents:")

    # for document in documents:
    #     print(document)


    # ========================================================
    # 10. DOCUMENT DATABASE INSERTION
    # ========================================================

    document_response = insert_documents(
        scholarship_id,
        documents
    )

    print("\nDocument Database Response:")
    print(document_response)


    # ========================================================
    # 11. SCHOLARSHIP COVERAGE TEXT EXTRACTION
    # ========================================================

    coverage_text = build_text(
        sections,
        include_titles=[
            "Scholarship Coverage"
        ]
    )

    coverage_text = clean_text(
        coverage_text
    )

    coverage_sentences = split_sentences(
        coverage_text
    )


    # ========================================================
    # 12. COVERAGE EXTRACTION
    # ========================================================

    coverage = extract_coverage(
        coverage_sentences
    )

    # print("\nExtracted Coverage:")
    # print(coverage)


    # ========================================================
    # 13. COVERAGE DATABASE INSERTION
    # ========================================================

    coverage_response = insert_coverage(
        scholarship_id,
        coverage
    )

    print("\nCoverage Database Response:")
    print(coverage_response)


    # ========================================================
    # 14. CONTACT TEXT EXTRACTION
    # ========================================================

    contact_text = build_text(
        sections,
        include_titles=[
            "Contact Information"
        ]
    )

    contact_text = clean_text(
        contact_text
    )

    contact_sentences = split_sentences(
        contact_text
    )


    # ========================================================
    # 15. CONTACT EXTRACTION
    # ========================================================

    # print("CONTACT EXTRACTION")
    contact = extract_contact(
        contact_sentences
    )
    # print("\nExtracted Contact:")

    # for item in contact:
    #     print(item)


    # ========================================================
    # 16. CONTACT DATABASE INSERTION
    # ========================================================

    contact_response = insert_contact(
        scholarship_id,
        contact
    )

    print("\nContact Database Response:")
    print(contact_response)


    # ========================================================
    # 17. BUILD FINAL UNIFIED JSON
    # ========================================================

    extracted_data = {
        "programs": program_data,
        "eligibility": eligibility,
        "documents": documents,
        "coverage": coverage,
        "contact": contact
    }


    # ========================================================
    # 18. SAVE EXTRACTED JSON
    # ========================================================

    with open(
        FILE_PATH,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            extracted_data,
            file,
            indent=4,
            ensure_ascii=False
        )


    # ========================================================
    # 19. PIPELINE COMPLETE
    # ========================================================

    print("\n" + "=" * 70)
    print("SCHOLARSHIP EXTRACTION PIPELINE COMPLETED")
    print("=" * 70)

    print(f"\nExtracted JSON saved to:")
    print(FILE_PATH)

    return extracted_data


# ============================================================
# SCRIPT ENTRY POINT
# ============================================================

if __name__ == "__main__":

    result = run("china")