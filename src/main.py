from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from src.weatherapi.client import WeatherAPI, get_weather_api


app = FastAPI()
app.mount("/static", StaticFiles(directory="src/static"), name="static")

templates = Jinja2Templates(directory="src/templates")


@app.get("/", response_class=HTMLResponse)
async def read_home(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")


@app.get("/weather")
async def get_weather(city: str, days: int = 1, weather_api: WeatherAPI = Depends(get_weather_api)):
    return await weather_api.get_forecast(city, days=days)


@app.get("/complete")
async def get_city_name(q: str, weather_api: WeatherAPI = Depends(get_weather_api)):
    return await weather_api.auto_complete(q)
