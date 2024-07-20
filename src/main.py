from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .routers import view, api
from .constants import BASE_DIR


app = FastAPI()
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

app.include_router(view.router)
app.include_router(api.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
