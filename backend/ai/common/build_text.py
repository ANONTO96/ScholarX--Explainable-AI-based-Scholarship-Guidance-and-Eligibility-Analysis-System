def build_text(sections, include_titles=None):

    text = ""

    if include_titles is not None:
        include_titles = {
            title.lower()
            for title in include_titles
        }

    for section in sections:

        title = section["section_title"].lower()

        if include_titles is not None and title not in include_titles:
            continue

        text += f"""
            {section["section_content"]}

            ----------------------
            """

    return text