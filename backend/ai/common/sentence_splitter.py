import re

def split_sentences(text: str):
    """
    Convert scholarship requirement text into a list of sentences.
    """

    # Normalize separators
    text = text.replace("\r", "")
    text = text.replace("\n", " ")
    text = text.replace(";", ".")
    text = text.replace("-", "")

    # Remove multiple spaces
    text = re.sub(r"\s+", " ", text)

    # Split by numbered list (1. 2. 3. ...)
    sentences = re.split(r"\s*\d+\.\s*", text)

    return [
        sentence.strip(" .")
        for sentence in sentences
        if sentence.strip()
    ]