import os
from groq import Groq


def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured.")

    return Groq(api_key=api_key)


def generate_chat_response(messages):
    model = os.getenv("GROQ_MODEL")

    if not model:
        raise RuntimeError("GROQ_MODEL is not configured.")

    client = get_groq_client()

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.4,
        max_tokens=2000,
    )

    return response.choices[0].message.content