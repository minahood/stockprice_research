"use client";

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

function formatTrendTick(v: number, mode: "relative" | "absolute"): string {
  if (mode === "absolute") {
    if (v >= 10000) return `${(v / 10000).toFixed(0)}万`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}千`;
    return String(v);
  }
  return String(v);
}

function formatTrendTooltip(v: number, mode: "relative" | "absolute"): string {
  if (mode === "absolute") {
    if (v >= 10000) return `約${(v / 10000).toFixed(1)}万回`;
    return `約${v.toLocaleString()}回`;
  }
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
  if (data.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, color: "#9ca3af" }}>
        データを取得するには会社・ゲームを選択して「グラフを表示」を押してください
      </div>
    );
  }

  // In absolute mode: Y-axis domain auto-scales to the data max
  const trendDomain: [number | string, number | string] =
    trendMode === "relative" ? [0, 100] : [0, "auto"];

  const trendLabel =
    trendMode === "relative"
      ? "検索トレンド (0-100)"
      : "推定検索数 (万回/週)";

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
          tickFormatter={(v: number) => formatTrendTick(v, trendMode)}
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
