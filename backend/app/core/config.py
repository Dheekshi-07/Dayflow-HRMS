from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    COMPANY_CODE: str = "OI"

    model_config = SettingsConfigDict(
        env_file="/Users/shreedvarshan/Desktop/Dayflow-HRMS/backend/.env",
        env_file_encoding="utf-8"
    )


settings = Settings()
