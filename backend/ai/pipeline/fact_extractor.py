from ai.extractors.age import extract_age
from ai.extractors.degree import extract_degree
from ai.extractors.language import extract_language
from ai.extractors.citizenship import extract_citizenship
from ai.extractors.health import extract_health
from ai.extractors.csca import extract_csca
from ai.extractors.experience import extract_experience


def extract_facts(sentences):

    facts = []

    extractors = [
        extract_age,
        extract_degree,
        extract_language,
        extract_citizenship,
        extract_health,
        extract_csca,
        extract_experience,
    ]

    for sentence in sentences:
        for extractor in extractors:
            facts.extend(extractor(sentence))

    return facts