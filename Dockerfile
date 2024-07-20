FROM python:3.11-slim

WORKDIR app/

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY .env ./.env
COPY src ./src
COPY src/templates ./src/templates
COPY src/static ./src/static

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

