import re


def clean_amount(value):
    """
    Convert amount text into an integer.

    Examples:
        '2,500' -> 2500
        '3500'  -> 3500
    """

    return int(
        value.replace(",", "").strip()
    )


def extract_coverage(sentences):
    """
    Extract scholarship coverage/benefits
    from already split sentences.
    """

    coverage = []

    text = " ".join(sentences)

    # =========================================================
    # 1. TUITION FEE
    # =========================================================

    tuition_pattern = re.compile(
        r"\btuition\s+fees?\b",
        re.IGNORECASE
    )

    if tuition_pattern.search(text):

        coverage.append({
            "benefit_type": "tuition_fee",
            "description": "Tuition fees",
            "coverage": "Tuition fees"
        })

    # =========================================================
    # 2. ACCOMMODATION
    # =========================================================

    accommodation_pattern = re.compile(
        r"free\s+university\s+dormitory"
        r"(?:\s+or\s+accommodation\s+subsidy)?",
        re.IGNORECASE
    )

    accommodation_match = accommodation_pattern.search(text)

    if accommodation_match:

        coverage.append({
            "benefit_type": "accommodation",
            "description": "Accommodation",
            "coverage": accommodation_match.group().strip()
        })

    # =========================================================
    # 3. STIPEND
    # =========================================================

    stipend_patterns = [
        (
            r"Undergraduates?\s*:\s*"
            r"CNY\s*([\d,]+)\s*per\s*month",
            ["Undergraduate"]
        ),

        (
            r"Master['’]?s\s+students?\s*/\s*"
            r"general\s+scholars?\s*:\s*"
            r"CNY\s*([\d,]+)\s*per\s*month",
            ["Master", "General Scholar"]
        ),

        (
            r"Doctoral\s+students?\s*/\s*"
            r"senior\s+scholars?\s*:\s*"
            r"CNY\s*([\d,]+)\s*per\s*month",
            ["Doctoral", "Senior Scholar"]
        )
    ]

    for pattern, programs in stipend_patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if not match:
            continue

        amount = clean_amount(
            match.group(1)
        )

        for program in programs:

            coverage.append({
                "benefit_type": "stipend",
                "description": "Monthly stipend",
                "program": program,
                "amount": amount,
                "currency": "CNY",
                "period": "month"
            })

    # =========================================================
    # 4. MEDICAL INSURANCE
    # =========================================================

    medical_year_pattern = re.compile(
        r"CNY\s*([\d,]+)\s*"
        r"per\s+person\s+per\s+year",
        re.IGNORECASE
    )

    medical_year_match = medical_year_pattern.search(text)

    if medical_year_match:

        amount = clean_amount(
            medical_year_match.group(1)
        )

        coverage.append({
            "benefit_type": "medical_insurance",
            "description": "Comprehensive medical insurance",
            "amount": amount,
            "currency": "CNY",
            "period": "person/year"
        })

    # =========================================================
    # 5. MEDICAL INSURANCE
    #    LESS THAN SIX MONTHS
    # =========================================================

    medical_short_pattern = re.compile(
        r"CNY\s*([\d,]+)\s*"
        r"per\s+person\s*"
        r"\(\s*for\s+programs?\s+"
        r"lasting\s+less\s+than\s+six\s+months\s*\)",
        re.IGNORECASE
    )

    medical_short_match = medical_short_pattern.search(text)

    if medical_short_match:

        amount = clean_amount(
            medical_short_match.group(1)
        )

        coverage.append({
            "benefit_type": "medical_insurance",
            "description": "Comprehensive medical insurance",
            "amount": amount,
            "currency": "CNY",
            "period": "person",
            "applicability": (
                "Programs lasting less than six months"
            )
        })

    return coverage