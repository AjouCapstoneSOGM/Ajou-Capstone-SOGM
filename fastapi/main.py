from fastapi import FastAPI
from model import PortfolioInfo
from config import Settings
from starlette.middleware.cors import CORSMiddleware
from make_portfolio import MakePortrolio

settings = Settings()  # 설정 인스턴스 생성
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_credentials,
    allow_methods=settings.cors_methods,
    allow_headers=settings.cors_headers,
)


@app.get("/makePortfolio")
async def makePortfolio(safe_asset_ratio: float, initial_cash: int):
    portfolio = MakePortrolio()
    tickers = [
        "054040.KQ",
        "264450.KQ",
        "094970.KQ",
        "069510.KQ",
        "046310.KQ",
        "079960.KQ",
        "017250.KQ",
        "192440.KQ",
        "039420.KQ",
        "029460.KS",
    ]
    result = portfolio.make_portfolio(tickers, safe_asset_ratio, initial_cash)
    return result
