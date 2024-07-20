import pytest
from fastapi.testclient import TestClient

from src.routers.api import router


client = TestClient(router)


@pytest.mark.asyncio
async def test_get_weather():
    response = client.get("/api/weather?city=London&days=5")
    assert response.status_code == 200
    assert response.json()["location"]["name"] == "London"
    assert len(response.json()["forecast"]["forecastday"]) == 5


@pytest.mark.asyncio
async def test_auto_complete():
    response = client.get("/api/complete?q=Lon")
    assert response.status_code == 200
    assert len(response.json()) == 5
    assert next(item for item in response.json() if item["name"] == "London")
