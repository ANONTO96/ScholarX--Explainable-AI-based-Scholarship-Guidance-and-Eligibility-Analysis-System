import re


def extract_contact(sentences):
    contacts = []

    text = " ".join(sentences)

    # --------------------------------
    # EMAIL
    # --------------------------------

    email_matches = re.findall(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        text
    )

    for email in email_matches:

        contacts.append({
            "contact_type": "email",
            "value": email
        })


    # --------------------------------
    # PHONE
    # --------------------------------

    phone_patterns = [
        r"(?:phone|telephone|tel|mobile|contact number)"
        r"\s*[:：]?\s*(\+?\d[\d\s\-()]{7,}\d)"
    ]

    for pattern in phone_patterns:

        matches = re.findall(
            pattern,
            text,
            re.IGNORECASE
        )

        for phone in matches:

            phone = phone.strip()

            contacts.append({
                "contact_type": "phone",
                "value": phone
            })


    # --------------------------------
    # FAX
    # --------------------------------

    fax_matches = re.findall(
        r"(?:fax|facsimile)"
        r"\s*[:：]?\s*(\+?\d[\d\s\-()]{7,}\d)",
        text,
        re.IGNORECASE
    )

    for fax in fax_matches:

        contacts.append({
            "contact_type": "fax",
            "value": fax.strip()
        })


    # --------------------------------
    # WEBSITE
    # --------------------------------

    website_matches = re.findall(
        r"(?:https?://|www\.)[^\s,;]+",
        text,
        re.IGNORECASE
    )

    for website in website_matches:

        contacts.append({
            "contact_type": "website",
            "value": website.rstrip(".,)")
        })


    # --------------------------------
    # OFFICE / DEPARTMENT
    # --------------------------------

    office_patterns = [
        r"([A-Z][A-Za-z\s&'-]*International Students[A-Za-z\s&'-]*)",
        r"([A-Z][A-Za-z\s&'-]*(?:Office|Department|Center|Centre))"
    ]

    for pattern in office_patterns:

        matches = re.findall(
            pattern,
            text
        )

        for office in matches:

            office = office.strip()

            if office:

                contacts.append({
                    "contact_type": "office",
                    "value": office
                })


    # --------------------------------
    # ADDRESS
    # --------------------------------

    address_matches = re.findall(
        r"(?:Address|Mailing Address)"
        r"\s*[:：]\s*([^.;]+)",
        text,
        re.IGNORECASE
    )

    for address in address_matches:

        address = address.strip()

        if address:

            contacts.append({
                "contact_type": "address",
                "value": address
            })


    return contacts