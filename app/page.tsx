"use client";

import { useEffect, useState } from "react";
import { fetchCompanies, fetchGames, fetchStock, fetchTrends } from "@/lib/api-client";
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
  const [presetGames, setPresetGames] = useState<Game[]>([]);
  const [addedGames, setAddedGames] = useState<AddedGame[]>([]);
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(defaultEndDate());

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currency, setCurrency] = useState("JPY");
  const [ticker, setTicker] = useState("");
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
  }

  function handleAddGame(game: AddedGame) {
    setAddedGames((prev) => [...prev, game]);
  }

  function handleRemoveGame(keyword: string) {
    setAddedGames((prev) => prev.filter((g) => g.keyword !== keyword));
  }

  async function handleFetch() {
    const company = companies.find((c) => c.id === selectedCompanyId);
    if (!company) {
      setError("会社を選択してください");
      return;
    }
    if (addedGames.length === 0) {
      setError("ゲームを1つ以上追加してください");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [stockRes, ...trendResults] = await Promise.all([
        fetchStock(company.ticker, startDate, endDate),
        ...addedGames.map((g) => fetchTrends(g.keyword, startDate, endDate)),
      ]);

      setCurrency(stockRes.currency);
      setTicker(company.ticker);

      const dateMap: Record<string, ChartDataPoint> = {};

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

      const merged = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
      setChartData(merged);
    } catch (e) {
      setError(e instanceof Error ? e.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }

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

          <GameSelector
            presetGames={presetGames}
            addedGames={addedGames}
            onAdd={handleAddGame}
            onRemove={handleRemoveGame}
          />

          <DateRangePicker
            start={startDate}
            end={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />

          <button
            onClick={handleFetch}
            disabled={loading || !selectedCompanyId || addedGames.length === 0}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: 15,
              fontWeight: "bold",
              borderRadius: 6,
              border: "none",
              background: loading ? "#93c5fd" : "#2563eb",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
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
              ticker={ticker}
            />
          </div>

          {chartData.length > 0 && (
            <p style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
              ※ 株価は週次（週初め）、検索トレンドはGoogleが提供する相対指数（0〜100）です
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
