"use client";

import { useState } from "react";
import type { AddedGame, Game } from "@/types";

const MAX_GAMES = 4;

export const CHIP_COLORS = [
  "#f97316", "#22c55e", "#ef4444", "#a855f7", "#06b6d4",
];

interface Props {
  presetGames: Game[];
  addedGames: AddedGame[];
  onAdd: (game: AddedGame) => void;
  onRemove: (keyword: string) => void;
}

export function GameSelector({ presetGames, addedGames, onAdd, onRemove }: Props) {
  const [customInput, setCustomInput] = useState("");

  const addedKeywords = new Set(addedGames.map((g) => g.keyword));

  function handlePresetAdd(game: Game) {
    if (addedGames.length >= MAX_GAMES) return;
    if (addedKeywords.has(game.keyword)) return;
    onAdd({ keyword: game.keyword, label: game.name });
  }

  function handleCustomAdd() {
    const kw = customInput.trim();
    if (!kw || addedGames.length >= MAX_GAMES || addedKeywords.has(kw)) return;
    onAdd({ keyword: kw, label: kw });
    setCustomInput("");
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
        ゲーム（最大{MAX_GAMES}件）
      </label>

      {/* Preset dropdown */}
      {presetGames.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <select
            value=""
            onChange={(e) => {
              const game = presetGames.find((g) => g.keyword === e.target.value);
              if (game) handlePresetAdd(game);
            }}
            style={{ width: "100%", padding: "6px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
            disabled={addedGames.length >= MAX_GAMES}
          >
            <option value="">-- プリセットから追加 --</option>
            {presetGames.map((g) => (
              <option key={g.id} value={g.keyword} disabled={addedKeywords.has(g.keyword)}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Custom input */}
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
          placeholder="任意のゲーム名を入力..."
          disabled={addedGames.length >= MAX_GAMES}
          style={{ flex: 1, padding: "6px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button
          onClick={handleCustomAdd}
          disabled={!customInput.trim() || addedGames.length >= MAX_GAMES}
          style={{
            padding: "6px 12px",
            fontSize: 14,
            borderRadius: 4,
            border: "none",
            background: "#3b82f6",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          追加
        </button>
      </div>

      {/* Added games chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {addedGames.map((g, i) => (
          <span
            key={g.keyword}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 10px",
              borderRadius: 999,
              background: CHIP_COLORS[i % CHIP_COLORS.length],
              color: "#fff",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {g.label}
            <button
              onClick={() => onRemove(g.keyword)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: 0,
                lineHeight: 1,
                fontSize: 15,
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
