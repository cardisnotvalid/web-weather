from urllib.parse import unquote

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, FileResponse

from .constants import COOKIE_LAST_CITY
from ..constants import templates, BASE_DIR


router = APIRouter(tags=["view"])


@router.get("/", response_class=HTMLResponse)
async def read_home(request: Request):
    last_city = request.cookies.get(COOKIE_LAST_CITY)
    if last_city:
        last_city = unquote(last_city)
    context = {"last_city": last_city}
    return templates.TemplateResponse(request=request, name="index.html", context=context)


@router.get("/favicon.ico", include_in_schema=True)
async def favicon():
    return FileResponse(BASE_DIR / "static/favicon.ico")
