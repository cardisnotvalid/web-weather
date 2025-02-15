from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    WEATHER_API_KEY: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


config = Settings()
