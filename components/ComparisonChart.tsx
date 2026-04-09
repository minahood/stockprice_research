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
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
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
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: "2px 0" }}>
          {entry.name}: {entry.value != null ? entry.value.toLocaleString() : "—"}
        </p>
      ))}
    </div>
  );
}

export function ComparisonChart({ data, addedGames, currency, ticker }: Props) {
  if (data.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, color: "#9ca3af" }}>
        データを取得するには会社・ゲームを選択して「グラフを表示」を押してください
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={450}>
      <ComposedChart data={data} margin={{ top: 10, right: 40, bottom: 10, left: 10 }}>
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
        {/* Right axis: trend index 0-100 */}
        <YAxis
          yAxisId="trend"
          orientation="right"
          domain={[0, 100]}
          tick={{ fontSize: 11 }}
          label={{ value: "検索トレンド (0-100)", angle: 90, position: "insideRight", offset: 10, style: { fontSize: 11 } }}
        />
        <Tooltip content={<CustomTooltip />} />
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
