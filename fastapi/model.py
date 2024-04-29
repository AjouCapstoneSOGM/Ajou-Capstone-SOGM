from pydantic import BaseModel


class PortfolioInfo(BaseModel):
    tickers: int
    safe_asset_ratio: float
    initial_cash: int
