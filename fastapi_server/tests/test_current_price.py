# test_make_portfolio.py
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_current_price_success():
    response = client.post(
        "/currentPrice/",
        json={
            "tickers": [
                "005930",
            ]
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert data["prices"][0]["ticker"] == "005930"
    assert "current_price" in data["prices"][0]


def test_current_price_no_ticker():
    response = client.post(
        "/currentPrice/",
        json={"tickers": []},
    )
    data = response.json()

    assert response.status_code == 400
    assert data["detail"] == "no tickers"


def test_current_price_wrong_ticker():
    response = client.post(
        "/currentPrice/",
        json={"tickers": ["123456"]},
    )
    data = response.json()

    assert response.status_code == 200
    assert data["prices"][0]["current_price"] == "OCTYPE"
