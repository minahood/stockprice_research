interface Props {
  start: string;
  end: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
}

export function DateRangePicker({ start, end, onStartChange, onEndChange }: Props) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
        期間
      </label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="date"
          value={start}
          max={end}
          onChange={(e) => onStartChange(e.target.value)}
          style={{ flex: 1, padding: "6px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <span style={{ color: "#666" }}>〜</span>
        <input
          type="date"
          value={end}
          min={start}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => onEndChange(e.target.value)}
          style={{ flex: 1, padding: "6px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
        />
      </div>
    </div>
  );
}
