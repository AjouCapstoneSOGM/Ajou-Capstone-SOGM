# test_make_portfolio.py
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_make_portfolio_success():
    response = client.get(
        "/fearGreed/"
    )
    data = response.json()

    assert response.status_code == 200
    assert "fear_greed" in data
