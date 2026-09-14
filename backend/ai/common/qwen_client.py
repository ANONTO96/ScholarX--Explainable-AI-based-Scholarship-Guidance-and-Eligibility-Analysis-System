from ollama import chat

def ask_qwen(prompt):

    response = chat(
        model="qwen2.5:7b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        format="json",
        options={
            "temperature": 0,
            "top_p": 0,
            "top_k": 1,
            "seed": 42,
        }
    )

    return response["message"]["content"]