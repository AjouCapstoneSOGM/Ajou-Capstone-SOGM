# test_make_portfolio.py
import sys
import os

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../fastapi_server"))
)

from fastapi.testclient import TestClient
from fastapi_server.main import app

client = TestClient(app)


def test_news_summary_success():
    response = client.post(
        "/getNews/",
        json={
            "ticker": "005930",
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert "summary" in data
    assert len(data["summary"]) > 0


def test_news_summary_no_news():
    response = client.post(
        "/getNews/",
        json={
            "ticker": "123456",
        },
    )
    data = response.json()

    assert response.status_code == 204
    assert data["detail"] == "no news"
