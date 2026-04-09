import time
import yfinance as yf
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pytrends.request import TrendReq

from config import COMPANIES, COMPANY_MAP
from models import Company, CompanyWithGames, Game, StockResponse, StockPoint, TrendResponse, TrendPoint

app = FastAPI(title="Game Stock & Trends API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/companies", response_model=list[Company])
def get_companies():
    return [Company(id=c["id"], name=c["name"], ticker=c["ticker"]) for c in COMPANIES]


@app.get("/companies/{company_id}/games", response_model=list[Game])
def get_games(company_id: str):
    company = COMPANY_MAP.get(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return [Game(**g) for g in company["games"]]


@app.get("/stock", response_model=StockResponse)
def get_stock(
    ticker: str = Query(..., description="Yahoo Finance ticker symbol"),
    start: str = Query(..., description="Start date YYYY-MM-DD"),
    end: str = Query(..., description="End date YYYY-MM-DD"),
):
    try:
        df = yf.download(ticker, start=start, end=end, auto_adjust=True, progress=False)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"yfinance error: {e}")

    if df.empty:
        raise HTTPException(status_code=404, detail="No stock data found for given ticker/range")

    # Resample to weekly (Friday close) to align with Google Trends weekly data
    close = df["Close"]
    if isinstance(close.columns if hasattr(close, "columns") else [], list):
        close = close.iloc[:, 0]
    weekly = close.resample("W-FRI").last().dropna()

    currency = yf.Ticker(ticker).fast_info.get("currency", "JPY")

    data = [
        StockPoint(date=d.strftime("%Y-%m-%d"), close=round(float(v), 2))
        for d, v in weekly.items()
    ]
    return StockResponse(ticker=ticker, currency=currency, data=data)


@app.get("/trends", response_model=TrendResponse)
def get_trends(
    keyword: str = Query(..., description="Search keyword for Google Trends"),
    start: str = Query(..., description="Start date YYYY-MM-DD"),
    end: str = Query(..., description="End date YYYY-MM-DD"),
):
    try:
        pytrends = TrendReq(hl="ja-JP", tz=540)  # JST
        timeframe = f"{start} {end}"
        pytrends.build_payload([keyword], timeframe=timeframe, geo="JP")
        time.sleep(0.5)
        df = pytrends.interest_over_time()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"pytrends error: {e}")

    if df is None or df.empty:
        raise HTTPException(status_code=404, detail="No trend data found for given keyword/range")

    if "isPartial" in df.columns:
        df = df.drop(columns=["isPartial"])

    data = [
        TrendPoint(date=d.strftime("%Y-%m-%d"), interest=int(v))
        for d, v in df[keyword].items()
    ]
    return TrendResponse(keyword=keyword, data=data)
