# test_make_portfolio.py
import sys
import os

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../fastapi_server"))
)

from fastapi.testclient import TestClient
from fastapi_server.main import app

client = TestClient(app)


def test_make_portfolio_success():
    response = client.post(
        "/makePortfolio/",
        json={
            "tickers": [
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
            ],
            "safe_asset_ratio": 0.1,
            "initial_cash": 1000000,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "int_asset_num" in data
    assert len(data["int_asset_num"]) == 10

    assert "cash_hold" in data
    assert data["cash_hold"] > 0

    assert "total_ratio_final" in data

    assert "final_returns" in data
    assert "final_vol" in data


def test_make_portfolio_tickers_under_10():
    response = client.post(
        "/makePortfolio/",
        json={
            "tickers": [],
            "safe_asset_ratio": 0.1,
            "initial_cash": 1000000,
        },
    )
    data = response.json()

    assert response.status_code == 400
    assert data["detail"] == "less than 10 tickers"


def test_make_portfolio_cash_under_million():
    response = client.post(
        "/makePortfolio/",
        json={
            "tickers": [
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
            ],
            "safe_asset_ratio": 0.1,
            "initial_cash": 0,
        },
    )
    data = response.json()

    assert response.status_code == 400
    assert data["detail"] == "less than million cash"
