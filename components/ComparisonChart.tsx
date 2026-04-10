"use client";

import { useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint, AddedGame } from "@/types";
import { CHIP_COLORS } from "./GameSelector";

const STOCK_COLOR = "#2563eb";

interface Props {
  data: ChartDataPoint[];
  addedGames: AddedGame[];
  currency: string;
  ticker: string;
  trendMode: "relative" | "absolute";
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function formatTrendTooltip(v: number, mode: "relative" | "absolute"): string {
  if (mode === "absolute") return `${v}（比較値）`;
  return String(v);
}

function CustomTooltip({
  active,
  payload,
  label,
  trendMode,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  trendMode: "relative" | "absolute";
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <p style={{ fontWeight: "bold", marginBottom: 6 }}>{label}</p>
      {payload.map((entry) => {
        const isStock = entry.name.startsWith("株価");
        const display = isStock
          ? entry.value.toLocaleString()
          : formatTrendTooltip(entry.value, trendMode);
        return (
          <p key={entry.name} style={{ color: entry.color, margin: "2px 0" }}>
            {entry.name}: {display}
          </p>
        );
      })}
    </div>
  );
}

export function ComparisonChart({ data, addedGames, currency, ticker, trendMode }: Props) {
  // Calculate actual max from data so the axis fits the data, not a fixed ceiling
  const trendMax = useMemo(() => {
    let max = 0;
    for (const point of data) {
      for (const game of addedGames) {
        const v = point[`trend_${game.keyword}`];
        if (typeof v === "number" && v > max) max = v;
      }
    }
    if (max === 0) return 100;
    // Round up to a clean number (next multiple of 10 or 20)
    return Math.ceil(max / 10) * 10;
  }, [data, addedGames]);

  if (data.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, color: "#9ca3af" }}>
        データを取得するには会社・ゲームを選択して「グラフを表示」を押してください
      </div>
    );
  }

  const trendDomain: [number, number] = [0, trendMax];

  const trendLabel =
    trendMode === "relative"
      ? "検索トレンド (個別 0-100)"
      : "検索ボリューム比較 (0-100)";

  return (
    <ResponsiveContainer width="100%" height={450}>
      <ComposedChart data={data} margin={{ top: 10, right: 50, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickFormatter={(v: string) => v.slice(0, 7)}
          minTickGap={40}
        />
        {/* Left axis: stock price */}
        <YAxis
          yAxisId="stock"
          orientation="left"
          tickFormatter={(v: number) => v.toLocaleString()}
          tick={{ fontSize: 11 }}
          label={{ value: `株価 (${currency})`, angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 11 } }}
        />
        {/* Right axis: trend (relative 0-100 or absolute estimated count) */}
        <YAxis
          yAxisId="trend"
          orientation="right"
          domain={trendDomain}
          tick={{ fontSize: 11 }}
          label={{ value: trendLabel, angle: 90, position: "insideRight", offset: 15, style: { fontSize: 11 } }}
        />
        <Tooltip content={<CustomTooltip trendMode={trendMode} />} />
        <Legend />

        {/* Stock price line */}
        <Line
          yAxisId="stock"
          type="monotone"
          dataKey="close"
          name={`株価 ${ticker}`}
          stroke={STOCK_COLOR}
          strokeWidth={2}
          dot={false}
          connectNulls
        />

        {/* One line per added game */}
        {addedGames.map((game, i) => (
          <Line
            key={game.keyword}
            yAxisId="trend"
            type="monotone"
            dataKey={`trend_${game.keyword}`}
            name={game.label}
            stroke={CHIP_COLORS[i % CHIP_COLORS.length]}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
