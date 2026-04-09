import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!ticker || !start || !end) {
    return NextResponse.json({ detail: "ticker, start, end are required" }, { status: 400 });
  }

  try {
    const rows = await yahooFinance.historical(ticker, {
      period1: start,
      period2: end,
      interval: "1wk",
    });

    const data = rows
      .filter((r) => r.close != null && !isNaN(r.close))
      .map((r) => ({
        date: r.date.toISOString().slice(0, 10),
        close: Math.round(r.close * 100) / 100,
      }));

    // Determine currency from ticker suffix
    const currency = ticker.endsWith(".T") ? "JPY" : "USD";

    return NextResponse.json({ ticker, currency, data });
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 502 });
  }
}
