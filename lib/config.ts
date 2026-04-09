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
      { id: "zelda", name: "ゼルダの伝説", keyword: "ゼルダの伝説" },
      { id: "pokemon", name: "ポケモン", keyword: "ポケモン" },
      { id: "animal_crossing", name: "どうぶつの森", keyword: "どうぶつの森" },
      { id: "splatoon", name: "スプラトゥーン", keyword: "スプラトゥーン" },
    ],
  },
  {
    id: "sony",
    name: "ソニー",
    ticker: "6758.T",
    games: [
      { id: "god_of_war", name: "God of War", keyword: "God of War" },
      { id: "spiderman", name: "Marvel's Spider-Man", keyword: "Marvel Spider-Man game" },
      { id: "horizon", name: "Horizon", keyword: "Horizon Forbidden West" },
      { id: "gran_turismo", name: "Gran Turismo", keyword: "Gran Turismo" },
    ],
  },
  {
    id: "capcom",
    name: "カプコン",
    ticker: "9697.T",
    games: [
      { id: "monster_hunter", name: "モンスターハンター", keyword: "モンスターハンター" },
      { id: "biohazard", name: "バイオハザード", keyword: "バイオハザード" },
      { id: "street_fighter", name: "ストリートファイター", keyword: "ストリートファイター" },
      { id: "ace_attorney", name: "逆転裁判", keyword: "逆転裁判" },
    ],
  },
  {
    id: "square_enix",
    name: "スクウェア・エニックス",
    ticker: "9684.T",
    games: [
      { id: "final_fantasy", name: "ファイナルファンタジー", keyword: "ファイナルファンタジー" },
      { id: "dragon_quest", name: "ドラゴンクエスト", keyword: "ドラゴンクエスト" },
      { id: "kingdom_hearts", name: "キングダムハーツ", keyword: "キングダムハーツ" },
    ],
  },
  {
    id: "konami",
    name: "コナミ",
    ticker: "9766.T",
    games: [
      { id: "pro_baseball", name: "プロ野球スピリッツ", keyword: "プロ野球スピリッツ" },
      { id: "yugioh", name: "遊戯王", keyword: "遊戯王" },
      { id: "metal_gear", name: "メタルギア", keyword: "メタルギア" },
      { id: "efootball", name: "eFootball", keyword: "eFootball" },
    ],
  },
];

export const COMPANY_MAP: Record<string, CompanyEntry> = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c])
);
