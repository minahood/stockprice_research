from pydantic import BaseModel
from typing import Optional


class Game(BaseModel):
    id: str
    name: str
    keyword: str


class Company(BaseModel):
    id: str
    name: str
    ticker: str


class CompanyWithGames(Company):
    games: list[Game]


class StockPoint(BaseModel):
    date: str
    close: float


class StockResponse(BaseModel):
    ticker: str
    currency: str
    data: list[StockPoint]


class TrendPoint(BaseModel):
    date: str
    interest: int


class TrendResponse(BaseModel):
    keyword: str
    data: list[TrendPoint]
