from fastapi import FastAPI, status, HTTPException
from fastapi.responses import JSONResponse
from utils.config import Settings
from utils.model import PortfolioInfo, TickerList, Ticker, PortfolioFinal
from starlette.middleware.cors import CORSMiddleware
from make_portfolio.make_portfolio import MakePortrolio
from current_price.current_price import fetch_all_prices
from news_summary.get_news_summary import News
from news_summary.gpt import Chatbot
import uvicorn

settings = Settings()  # 설정 인스턴스 생성
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_credentials,
    allow_methods=settings.cors_methods,
    allow_headers=settings.cors_headers,
)


@app.post("/makePortfolio/")
async def makePortfolio(portfolio_info: PortfolioInfo, response_model=PortfolioFinal):
    if len(portfolio_info.tickers) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="less than 10 tickers"
        )

    if portfolio_info.initial_cash < 1000000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="less than million cash"
        )

    portfolio = MakePortrolio()
    result = portfolio.make_portfolio(
        portfolio_info.tickers,
        portfolio_info.safe_asset_ratio,
        portfolio_info.initial_cash,
    )
    return result


@app.post("/currentPrice/")
async def get_current_prices(tickers: TickerList):
    if len(tickers.tickers) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="no tickers"
        )

    prices = await fetch_all_prices(tickers.tickers)
    return {"prices": prices}


@app.post("/getNews/")
async def get_News(ticker: Ticker):
    news = News()
    chatbot = Chatbot()
    headlines = await news.get_company_news(ticker.ticker)

    if len(headlines) == 0:
        return JSONResponse(
            status_code=status.HTTP_204_NO_CONTENT, content={"detail": "no news"}
        )

    summary = await chatbot.summary("".join(headlines), ticker.ticker)
    return {"summary": summary}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
