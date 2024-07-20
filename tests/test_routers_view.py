import pytest
from fastapi.testclient import TestClient

from src.main import app


client = TestClient(app)


def test_read_home():
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["Content-Type"]
