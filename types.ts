export interface Company {
  id: string;
  name: string;
  ticker: string;
}

export interface Game {
  id: string;
  name: string;
  keyword: string;
}

export interface StockPoint {
  date: string;
  close: number;
}

export interface StockResponse {
  ticker: string;
  currency: string;
  data: StockPoint[];
}

export interface TrendPoint {
  date: string;
  interest: number;
}

export interface TrendResponse {
  keyword: string;
  data: TrendPoint[];
}

export interface AddedGame {
  keyword: string;
  label: string;
}

export interface ChartDataPoint {
  date: string;
  close?: number;
  [key: string]: number | string | undefined; // trend_{keyword}
}
