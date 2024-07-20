from urllib.parse import quote

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from .constants import COOKIE_LAST_CITY
from ..weather_api import WeatherAPI, get_weather_api


router = APIRouter(prefix="/api", tags=["api"])


@router.get("/weather")
async def get_weather(city: str, days: int = 7, api: WeatherAPI = Depends(get_weather_api)):
    weather_data = await api.get_forecast(city, days=days)
    response = JSONResponse(content=weather_data)
    response.set_cookie(key=COOKIE_LAST_CITY, value=quote(city))
    return response


@router.get("/complete")
async def auto_complete(q: str, api: WeatherAPI = Depends(get_weather_api)):
    return await api.auto_complete(q)

