from openai import OpenAI
import os


class Chatbot:
    def __init__(self):
        self.client = OpenAI(
            api_key=os.environ.get("ETA_OPENAI_KEY"),
        )

    async def summary(self, data, ticker):
        completion = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an assistant that summarizes important stock market news. Make the parts and summarize those news headlines as detail as possible in korean.",
                },
                {
                    "role": "user",
                    "content": "this news are about ticker: "
                    + "f{ticker}"
                    + "".join(data),
                },
            ],
        )

        return completion.choices[0].message.content
