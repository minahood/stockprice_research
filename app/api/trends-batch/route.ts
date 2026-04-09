import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const googleTrends = require("google-trends-api") as {
  interestOverTime: (opts: {
    keyword: string | string[];
    startTime: Date;
    endTime: Date;
    geo?: string;
  }) => Promise<string>;
};

interface TimelineItem {
  time: string;
  value: number[];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keywordsParam = searchParams.get("keywords"); // comma-separated
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!keywordsParam || !start || !end) {
    return NextResponse.json({ detail: "keywords, start, end are required" }, { status: 400 });
  }

  const keywords = keywordsParam.split(",").map((k) => k.trim()).filter(Boolean);
  if (keywords.length === 0) {
    return NextResponse.json({ detail: "At least one keyword required" }, { status: 400 });
  }

  try {
    // Query all keywords together so values are normalized relative to each other
    const raw = await googleTrends.interestOverTime({
      keyword: keywords.length === 1 ? keywords[0] : keywords,
      startTime: new Date(start),
      endTime: new Date(end),
      geo: "JP",
    });

    const parsed = JSON.parse(raw) as { default: { timelineData: TimelineItem[] } };
    const timelineData = parsed.default.timelineData;

    const result = keywords.map((keyword, i) => ({
      keyword,
      data: timelineData.map((item) => ({
        date: new Date(parseInt(item.time) * 1000).toISOString().slice(0, 10),
        interest: item.value[i] ?? 0,
      })),
    }));

    return NextResponse.json({ keywords, result });
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 502 });
  }
}
