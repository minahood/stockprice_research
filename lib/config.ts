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
  {
    id: "cyberagent",
    name: "サイバーエージェント",
    ticker: "4751.T",
    games: [
      { id: "umamusume", name: "ウマ娘 プリティーダービー", keyword: "ウマ娘 プリティーダービー" },
      { id: "granblue", name: "グランブルーファンタジー", keyword: "グランブルーファンタジー" },
      { id: "shadowverse", name: "シャドウバース", keyword: "シャドウバース" },
      { id: "princess_connect", name: "プリンセスコネクト", keyword: "プリンセスコネクト Re:Dive" },
      { id: "world_flipper", name: "ワールドフリッパー", keyword: "ワールドフリッパー" },
    ],
  },
  {
    id: "dena",
    name: "DeNA",
    ticker: "2432.T",
    games: [
      { id: "othellonia", name: "逆転オセロニア", keyword: "逆転オセロニア" },
      { id: "pokemon_masters", name: "ポケモンマスターズEX", keyword: "ポケモンマスターズ" },
      { id: "fe_heroes", name: "ファイアーエムブレムヒーローズ", keyword: "ファイアーエムブレムヒーローズ" },
      { id: "hachinaicg", name: "八月のシンデレラナイン", keyword: "八月のシンデレラナイン" },
      { id: "baseball_superstars", name: "プロ野球 PRIDE", keyword: "プロ野球 PRIDE DeNA" },
    ],
  },
  {
    id: "koei_tecmo",
    name: "コーエーテクモHD",
    ticker: "3635.T",
    games: [
      { id: "nioh", name: "仁王", keyword: "仁王 ゲーム" },
      { id: "sangokushi", name: "三國志", keyword: "三國志 コーエー" },
      { id: "nobunaga", name: "信長の野望", keyword: "信長の野望" },
      { id: "musou", name: "真・三國無双", keyword: "真・三國無双" },
      { id: "doa", name: "Dead or Alive", keyword: "Dead or Alive game" },
    ],
  },
];

export const COMPANY_MAP: Record<string, CompanyEntry> = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c])
);
