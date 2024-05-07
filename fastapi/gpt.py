from openai import OpenAI
import os


class Chatbot:
    def __init__(self):
        self.client = OpenAI(
            api_key=os.environ.get("ETA_OPENAI_KEY"),
        )

    async def summary(self, data, ticker):
        completion = self.client.chat.completions.create(
            model="ft:gpt-3.5-turbo-0125:personal::9LakEBxS",
            messages=[
                {
                    "role": "system",
                    "content": "You are an assistant that summarizes important stock market news in korean. Please summarize the following news headlines about given stock. Make the parts and provide the summaries in a format of markdown, ## Title\nContent, as detail as possible. Focusing only on details relevant to give ticker.",
                },
                {
                    "role": "user",
                    "content": "this news are about ticker: " + ticker + "".join(data),
                },
            ],
        )

        return completion.choices[0].message.content
