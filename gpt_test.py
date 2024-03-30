from openai import OpenAI
import os

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

completion = client.chat.completions.create(
    model="gpt-4-0125-preview",
    messages=[
        {
            "role": "system",
            "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair. use Korean.",
        },
        {
            "role": "user",
            "content": "안녕",
        },
    ],
)

print(completion.choices[0].message)
