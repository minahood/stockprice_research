import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ゲーム株価 × 検索トレンド 比較",
  description: "ゲーム会社の株価とゲームタイトルのGoogle検索トレンドを比較",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
