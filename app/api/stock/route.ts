import { NextResponse } from "next/server";

interface YahooChartResult {
  meta: { currency?: string };
  timestamp: number[];
  indicators: {
    quote: Array<{ close: (number | null)[] }>;
  };
}

interface YahooChartResponse {
  chart: {
    result: YahooChartResult[] | null;
    error?: { description: string };
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!ticker || !start || !end) {
    return NextResponse.json({ detail: "ticker, start, end are required" }, { status: 400 });
  }

  try {
    const period1 = Math.floor(new Date(start).getTime() / 1000);
    const period2 = Math.floor(new Date(end).getTime() / 1000);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1wk&period1=${period1}&period2=${period2}`;

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) {
      return NextResponse.json({ detail: `Yahoo Finance returned HTTP ${res.status}` }, { status: 502 });
    }

    const json = (await res.json()) as YahooChartResponse;
    const result = json.chart?.result?.[0];

    if (!result) {
      const msg = json.chart?.error?.description ?? "No data found";
      return NextResponse.json({ detail: msg }, { status: 404 });
    }

    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;
    const currency = result.meta.currency ?? (ticker.endsWith(".T") ? "JPY" : "USD");

    const data = timestamps
      .map((ts, i) => ({ date: new Date(ts * 1000).toISOString().slice(0, 10), close: closes[i] }))
      .filter((d): d is { date: string; close: number } => d.close != null && !isNaN(d.close))
      .map((d) => ({ date: d.date, close: Math.round(d.close * 100) / 100 }));

    return NextResponse.json({ ticker, currency, data });
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 502 });
  }
}
