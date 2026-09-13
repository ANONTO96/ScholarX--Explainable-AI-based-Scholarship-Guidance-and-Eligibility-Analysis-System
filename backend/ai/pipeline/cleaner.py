#!/usr/bin/env python3

import re
import html


def clean_text(raw_text: str) -> str:
    """
    Clean scholarship raw text before sentence splitting.

    Returns:
        Clean string.
    """

    if not raw_text:
        return ""

    # Decode HTML entities
    text = html.unescape(raw_text)

    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)

    # Normalize quotes
    text = (
        text.replace("“", '"')
            .replace("”", '"')
            .replace("‘", "'")
            .replace("’", "'")
    )

    # Normalize dashes
    text = (
        text.replace("–", "-")
            .replace("—", "-")
    )

    # Replace tabs/newlines
    text = text.replace("\r", " ")
    text = text.replace("\n", " ")
    text = text.replace("\t", " ")

    # Remove repeated spaces
    text = re.sub(r"\s+", " ", text)

    # Remove spaces before punctuation
    text = re.sub(r"\s+([.,;:!?])", r"\1", text)

    # Trim
    text = text.strip()

    return text