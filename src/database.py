from sqlmodel import SQLModel, Field, Session, create_engine

from src.config import config


connect_args = {"check_same_thread": False}
engine = create_engine(config.DATABASE_URL, echo=True, connect_args=connect_args)


def get_session():
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


if __name__ == "__main__":
    create_db_and_tables()
