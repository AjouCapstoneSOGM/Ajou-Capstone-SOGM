from pydantic import BaseModel
from typing import List


class PortfolioInfo(BaseModel):
    tickers: List[str]
    safe_asset_ratio: float
    initial_cash: int


class TickerList(BaseModel):
    tickers: List[str]
