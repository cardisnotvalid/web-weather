import pytest
from fastapi.testclient import TestClient

from src.main import app


client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200


def test_static_files():
    response = client.get("/static/styles.css")
    assert response.status_code == 200

    response = client.get("/static/index.js")
    assert response.status_code == 200


def test_cors():
    response = client.options("/api/weather")
    assert response.headers["Access-Control-Allow-Origin"] == "*"
    assert response.headers["Access-Control-Allow-Credentials"] == "true"
    assert response.headers["Access-Control-Allow-Methods"] == "OPTIONS, GET"
    assert response.headers["Access-Control-Allow-Headers"] == "*"
