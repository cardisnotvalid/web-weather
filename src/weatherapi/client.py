from typing import Optional, List, Dict, Any

import httpx
from httpx import Response, Request, Timeout

from src.config import config


class WeatherAPI:
    client: httpx.AsyncClient

    api_key: str

    def __init__(self) -> None:
        self.api_key = config.WEATHER_API_KEY
        self.client = httpx.AsyncClient(base_url=self.base_url)

    async def close(self) -> None:
        if hasattr(self, "client.g"):
            await self.client.aclose()

    async def __aenter__(self) -> "WeatherAPI":
        return self

    async def __aexit__(self, *args) -> None:
        await self.close()

    async def get_forecast(self, city: str, *, days: int) -> Dict[str, Any]:
        return (await self._get("forecast.json", {"q": city, "days": days})).json()

    async def auto_complete(self, q: str) -> List[Dict[str, Any]]:
        return (await self._get("search.json", {"q": q})).json()

    async def _get(self, endpoint: str, params: Dict[str, Any]) -> Request:
        return await self.client.get(endpoint, params=self._prepare_params(params))

    def _prepare_params(self, params: Dict[str, Any]) -> Dict[str, Any]:
        return {"key": self.api_key, "lang": "ru", **params}

    @property
    def base_url(self) -> str:
        return "http://api.weatherapi.com/v1/"


async def get_weather_api():
    async with WeatherAPI() as client:
        yield client


if __name__ == "__main__":
    api = WeatherAPI()

    print(api.get_current("moscow"))
    print(api.get_forecast("moscow"))
