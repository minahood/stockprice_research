"use client";

import { useEffect, useState } from "react";
import { fetchCompanies, fetchGames, fetchStock, fetchTrends, fetchTrendsBatch } from "@/lib/api-client";
import { CompanySelector } from "@/components/CompanySelector";
import { GameSelector } from "@/components/GameSelector";
import { DateRangePicker } from "@/components/DateRangePicker";
import { ComparisonChart } from "@/components/ComparisonChart";
import type { AddedGame, ChartDataPoint, Company, Game } from "@/types";

function defaultEndDate() {
  return new Date().toISOString().slice(0, 10);
}

function defaultStartDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 2);
  return d.toISOString().slice(0, 10);
}

export default function Page() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [tickerInput, setTickerInput] = useState("");
  const [presetGames, setPresetGames] = useState<Game[]>([]);
  const [addedGames, setAddedGames] = useState<AddedGame[]>([]);
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(defaultEndDate());
  const [trendMode, setTrendMode] = useState<"relative" | "absolute">("relative");

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currency, setCurrency] = useState("JPY");
  const [displayTicker, setDisplayTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies().then(setCompanies).catch(() => setError("会社一覧の取得に失敗しました"));
  }, []);

  useEffect(() => {
    if (!selectedCompanyId) {
      setPresetGames([]);
      return;
    }
    fetchGames(selectedCompanyId).then(setPresetGames).catch(() => setPresetGames([]));
  }, [selectedCompanyId]);

  function handleCompanyChange(id: string) {
    setSelectedCompanyId(id);
    setAddedGames([]);
    setChartData([]);
    setError(null);
    const company = companies.find((c) => c.id === id);
    setTickerInput(company ? company.ticker : "");
  }

  function handleAddGame(game: AddedGame) {
    setAddedGames((prev) => [...prev, game]);
  }

  function handleRemoveGame(keyword: string) {
    setAddedGames((prev) => prev.filter((g) => g.keyword !== keyword));
  }

  async function handleFetch() {
    const ticker = tickerInput.trim();
    if (!ticker) {
      setError("銘柄コードを入力してください");
      return;
    }
    if (addedGames.length === 0) {
      setError("ゲームを1つ以上追加してください");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dateMap: Record<string, ChartDataPoint> = {};

      if (trendMode === "relative") {
        // Individual queries (each keyword independently normalized to 0-100)
        const [stockRes, ...trendResults] = await Promise.all([
          fetchStock(ticker, startDate, endDate),
          ...addedGames.map((g) => fetchTrends(g.keyword, startDate, endDate)),
        ]);
        setCurrency(stockRes.currency);
        setDisplayTicker(ticker);

        for (const point of stockRes.data) {
          dateMap[point.date] = { date: point.date, close: point.close };
        }
        trendResults.forEach((trendRes, i) => {
          const keyword = addedGames[i].keyword;
          for (const point of trendRes.data) {
            if (!dateMap[point.date]) dateMap[point.date] = { date: point.date };
            dateMap[point.date][`trend_${keyword}`] = point.interest;
          }
        });
      } else {
        // Batch query with YouTube as hidden reference keyword for calibration.
        // YouTube JP weekly search volume ≈ 3,000,000. We include it so all keywords
        // are normalized on the same scale, then derive: estimated = (game / youtube) × 3,000,000.
        const REFERENCE_KEYWORD = "YouTube";
        const REFERENCE_WEEKLY_JP = 3_000_000;

        const batchKeywords = [...addedGames.map((g) => g.keyword), REFERENCE_KEYWORD];
        const [stockRes, batchResults] = await Promise.all([
          fetchStock(ticker, startDate, endDate),
          fetchTrendsBatch(batchKeywords, startDate, endDate),
        ]);
        setCurrency(stockRes.currency);
        setDisplayTicker(ticker);

        for (const point of stockRes.data) {
          dateMap[point.date] = { date: point.date, close: point.close };
        }

        // Build a date → YouTube index map for calibration
        const refResult = batchResults.find((r) => r.keyword === REFERENCE_KEYWORD);
        const refMap: Record<string, number> = {};
        refResult?.data.forEach((p) => { refMap[p.date] = p.interest; });

        // Apply calibration to game keywords only (exclude YouTube from chart)
        const gameResults = batchResults.filter((r) => r.keyword !== REFERENCE_KEYWORD);
        for (const { keyword, data } of gameResults) {
          for (const point of data) {
            if (!dateMap[point.date]) dateMap[point.date] = { date: point.date };
            const refVal = refMap[point.date] ?? 0;
            if (refVal > 0) {
              dateMap[point.date][`trend_${keyword}`] = Math.round(
                (point.interest / refVal) * REFERENCE_WEEKLY_JP
              );
            }
          }
        }
      }

      const merged = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
      setChartData(merged);
    } catch (e) {
      setError(e instanceof Error ? e.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  const canFetch = !loading && tickerInput.trim().length > 0 && addedGames.length > 0;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>
        ゲーム株価 × 検索トレンド 比較
      </h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
        ゲーム会社の株価と、ゲームタイトルのGoogle検索トレンドを同じグラフで比較できます
      </p>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <CompanySelector
            companies={companies}
            selectedId={selectedCompanyId}
            onChange={handleCompanyChange}
          />

          {/* Ticker input */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
              銘柄コード
            </label>
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
              placeholder="例: 7974.T, SONY, AAPL"
              style={{
                width: "100%",
                padding: "6px 8px",
                fontSize: 14,
                borderRadius: 4,
                border: `1px solid ${tickerInput.trim() ? "#2563eb" : "#ccc"}`,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>
              東証は末尾に .T を付けてください
            </p>
          </div>

          <GameSelector
            presetGames={presetGames}
            addedGames={addedGames}
            onAdd={handleAddGame}
            onRemove={handleRemoveGame}
          />

          {/* Trend mode toggle */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: 6 }}>
              検索数の表示形式
            </label>
            <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: "1px solid #d1d5db" }}>
              {(["relative", "absolute"] as const).map((mode) => {
                const active = trendMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setTrendMode(mode)}
                    style={{
                      flex: 1,
                      padding: "6px 4px",
                      fontSize: 12,
                      border: "none",
                      borderRight: mode === "relative" ? "1px solid #d1d5db" : "none",
                      background: active ? "#2563eb" : "#fff",
                      color: active ? "#fff" : "#374151",
                      cursor: "pointer",
                      fontWeight: active ? "bold" : "normal",
                      lineHeight: 1.3,
                    }}
                  >
                    {mode === "relative" ? "個別指数\n(0-100)" : "推定検索数\n(万回/週)"}
                  </button>
                );
              })}
            </div>
            {trendMode === "absolute" && (
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "4px 0 0", lineHeight: 1.4 }}>
                YouTubeをリファレンスに推定週次検索数を算出。キーワード間の差を実数で比較
              </p>
            )}
          </div>

          <DateRangePicker
            start={startDate}
            end={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />

          <button
            onClick={handleFetch}
            disabled={!canFetch}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: 15,
              fontWeight: "bold",
              borderRadius: 6,
              border: "none",
              background: loading ? "#93c5fd" : canFetch ? "#2563eb" : "#d1d5db",
              color: canFetch || loading ? "#fff" : "#9ca3af",
              cursor: canFetch ? "pointer" : "not-allowed",
              transition: "background 0.2s",
            }}
          >
            {loading ? "取得中..." : "グラフを表示"}
          </button>

          {error && (
            <div
              style={{
                marginTop: 12,
                padding: "8px 12px",
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: 6,
                color: "#b91c1c",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Chart area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 24,
            }}
          >
            <ComparisonChart
              data={chartData}
              addedGames={addedGames}
              currency={currency}
              ticker={displayTicker}
              trendMode={trendMode}
            />
          </div>

          {chartData.length > 0 && (
            <p style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
              ※ 株価は週次。
              {trendMode === "relative"
                ? "検索トレンドはGoogleが提供する相対指数（各キーワード独立で0〜100）です。"
                : "YouTubeをリファレンスに校正した推定週次検索数（日本）です。実際の数値とは異なる場合があります。"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
