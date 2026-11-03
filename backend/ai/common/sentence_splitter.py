
import re


def split_sentences(text: str):
    """Split numbered requirements and sentences without breaking parentheses."""

    if not text:
        return []

    text = text.replace("\r", " ").replace("\n", " ")
    text = re.sub(r"\s+", " ", text).strip()

    # Split numbered list items such as "1." and "10.".
    # Do not split values inside parentheses, such as "(Level 4)".
    text = re.sub(r"\s+(?=\d{1,2}\.\s+)", "\n", text)

    # Split sentence-ending punctuation.
    parts = re.split(
        r'(?<=[.!?])\s+(?=[A-Z"(])|\n+',
        text
    )

    return [
        part.strip(" \t\n.;")
        for part in parts
        if part.strip(" \t\n.;")
    ]
