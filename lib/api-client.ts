import type { Company, Game, StockResponse, TrendResponse } from "@/types";

const BASE = "/api";

export async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch(`${BASE}/companies`);
  if (!res.ok) throw new Error("会社一覧の取得に失敗しました");
  return res.json();
}

export async function fetchGames(companyId: string): Promise<Game[]> {
  const res = await fetch(`${BASE}/companies/${companyId}/games`);
  if (!res.ok) throw new Error("ゲーム一覧の取得に失敗しました");
  return res.json();
}

export async function fetchStock(
  ticker: string,
  start: string,
  end: string
): Promise<StockResponse> {
  const params = new URLSearchParams({ ticker, start, end });
  const res = await fetch(`${BASE}/stock?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "株価データの取得に失敗しました");
  }
  return res.json();
}

export async function fetchTrends(
  keyword: string,
  start: string,
  end: string
): Promise<TrendResponse> {
  const params = new URLSearchParams({ keyword, start, end });
  const res = await fetch(`${BASE}/trends?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "トレンドデータの取得に失敗しました");
  }
  return res.json();
}
