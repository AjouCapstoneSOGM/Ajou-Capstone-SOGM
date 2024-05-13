from fastapi import FastAPI, Response, status
from fastapi.responses import JSONResponse
from config import Settings
from model import PortfolioInfo, TickerList, Ticker, PortfolioFinal
from starlette.middleware.cors import CORSMiddleware
from make_portfolio import MakePortrolio
from current_price import fetch_all_prices
from get_news_summary import News
from gpt import Chatbot

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
    portfolio = MakePortrolio()
    result = portfolio.make_portfolio(
        portfolio_info.tickers,
        portfolio_info.safe_asset_ratio,
        portfolio_info.initial_cash,
    )
    return result


@app.post("/currentPrice/")
async def get_current_prices(tickers: TickerList):
    prices = await fetch_all_prices(tickers.tickers)
    return {"prices": prices}


@app.post("/getNews/")
async def get_News(ticker: Ticker):
    news = News()
    chatbot = Chatbot()
    headlines = await news.get_company_news(ticker.ticker)

    if len(headlines) == 0:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    summary = await chatbot.summary("".join(headlines), ticker.ticker)
    sections = summary.strip().split("## ")[1:]
    summary_json = []
    for section in sections:
        title, _, content = section.partition("\n")
        summary_json.append({"title": title.strip(), "content": content.strip()})

    return {"summary": summary_json}
