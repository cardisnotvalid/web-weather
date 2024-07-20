from pathlib import Path

from fastapi.templating import Jinja2Templates


BASE_DIR = Path(__file__).cwd() / "src"

templates = Jinja2Templates(directory=BASE_DIR / "templates")

