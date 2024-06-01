import httpx
import asyncio
from typing import List


async def fetch_current_price(ticker: str) -> str:
    url = f"https://finance.naver.com/item/main.naver?code={ticker}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            content = response.text
            start_index = content.find("<dd>현재가 ") + len("<dd>현재가 ")
            end_index = content.find(" ", start_index)
            current_price = content[start_index:end_index].replace(",", "")
            return {"ticker": ticker, "current_price": current_price}
        else:
            return {"ticker": ticker, "error": "Unable to fetch the price"}


async def fetch_all_prices(tickers: List[str]):
    return await asyncio.gather(*[fetch_current_price(ticker) for ticker in tickers])
