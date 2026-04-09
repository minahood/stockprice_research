import type { Company } from "../types";

interface Props {
  companies: Company[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function CompanySelector({ companies, selectedId, onChange }: Props) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>
        ゲーム会社
      </label>
      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "6px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
      >
        <option value="">-- 選択してください --</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.ticker})
          </option>
        ))}
      </select>
    </div>
  );
}
