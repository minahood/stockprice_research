export interface GameEntry {
  id: string;
  name: string;
  keyword: string;
}

export interface CompanyEntry {
  id: string;
  name: string;
  ticker: string;
  games: GameEntry[];
}

export const COMPANIES: CompanyEntry[] = [
  {
    id: "nintendo",
    name: "任天堂",
    ticker: "7974.T",
    games: [
      { id: "mario", name: "マリオ", keyword: "マリオ" },
      { id: "zelda", name: "ゼルダ", keyword: "ゼルダ" },
      { id: "pokemon", name: "ポケモン", keyword: "ポケモン" },
      { id: "animal_crossing", name: "どう森", keyword: "どう森" },
      { id: "splatoon", name: "スプラ", keyword: "スプラ" },
    ],
  },
  {
    id: "sony",
    name: "ソニー",
    ticker: "6758.T",
    games: [
      { id: "god_of_war", name: "GoW", keyword: "GoW" },
      { id: "spiderman", name: "スパイダーマン", keyword: "スパイダーマン" },
      { id: "horizon", name: "Horizon", keyword: "Horizon" },
      { id: "gran_turismo", name: "GT", keyword: "GT" },
    ],
  },
  {
    id: "capcom",
    name: "カプコン",
    ticker: "9697.T",
    games: [
      { id: "monster_hunter", name: "モンハン", keyword: "モンハン" },
      { id: "biohazard", name: "バイオ", keyword: "バイオ" },
      { id: "street_fighter", name: "ストファイ", keyword: "ストファイ" },
      { id: "ace_attorney", name: "逆裁", keyword: "逆裁" },
    ],
  },
  {
    id: "square_enix",
    name: "スクウェア・エニックス",
    ticker: "9684.T",
    games: [
      { id: "final_fantasy", name: "FF", keyword: "FF" },
      { id: "dragon_quest", name: "ドラクエ", keyword: "ドラクエ" },
      { id: "kingdom_hearts", name: "KH", keyword: "KH" },
    ],
  },
  {
    id: "konami",
    name: "コナミ",
    ticker: "9766.T",
    games: [
      { id: "pro_baseball", name: "スピリッツ", keyword: "スピリッツ" },
      { id: "yugioh", name: "遊戯王", keyword: "遊戯王" },
      { id: "metal_gear", name: "MGS", keyword: "MGS" },
      { id: "efootball", name: "eFootball", keyword: "eFootball" },
    ],
  },
  {
    id: "cyberagent",
    name: "サイバーエージェント",
    ticker: "4751.T",
    games: [
      { id: "umamusume", name: "ウマ娘", keyword: "ウマ娘" },
      { id: "granblue", name: "グラブル", keyword: "グラブル" },
      { id: "shadowverse", name: "シャドバ", keyword: "シャドバ" },
      { id: "princess_connect", name: "プリコネ", keyword: "プリコネ" },
      { id: "world_flipper", name: "ワーフリ", keyword: "ワーフリ" },
    ],
  },
  {
    id: "dena",
    name: "DeNA",
    ticker: "2432.T",
    games: [
      { id: "othellonia", name: "オセロニア", keyword: "オセロニア" },
      { id: "pokemon_masters", name: "ポケマス", keyword: "ポケマス" },
      { id: "fe_heroes", name: "FEH", keyword: "FEH" },
      { id: "hachinaicg", name: "ハチナイ", keyword: "ハチナイ" },
      { id: "baseball_superstars", name: "プロ野球PRIDE", keyword: "プロ野球PRIDE" },
    ],
  },
  {
    id: "koei_tecmo",
    name: "コーエーテクモHD",
    ticker: "3635.T",
    games: [
      { id: "nioh", name: "仁王", keyword: "仁王" },
      { id: "sangokushi", name: "三國志", keyword: "三國志" },
      { id: "nobunaga", name: "信長", keyword: "信長" },
      { id: "musou", name: "無双", keyword: "無双" },
      { id: "doa", name: "DoA", keyword: "DoA" },
    ],
  },
];

export const COMPANY_MAP: Record<string, CompanyEntry> = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c])
);
