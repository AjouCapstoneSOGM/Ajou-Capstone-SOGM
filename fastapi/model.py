from pydantic import BaseModel
from typing import List


class PortfolioInfo(BaseModel):
    tickers: List[str]
    safe_asset_ratio: float
    initial_cash: int


class PortfolioFinal(BaseModel):
    int_asset_num: List[int]
    cash_hold: int
    total_ratio_final: List[float]
    final_returns: float
    final_vol: float

class BackTest(BaseModel):
    port_return_90: float
    not_re_port_return_90: float
    kos_return_90: float
    port_return_180: float
    not_re_port_return_180: float
    kos_return_180: float
    port_return_360: float
    not_re_port_return_360: float
    kos_return_360: float

class TickerList(BaseModel):
    tickers: List[str]


class Ticker(BaseModel):
    ticker: str
