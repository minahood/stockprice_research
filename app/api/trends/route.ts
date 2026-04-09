import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const googleTrends = require("google-trends-api") as {
  interestOverTime: (opts: {
    keyword: string;
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
  const keyword = searchParams.get("keyword");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!keyword || !start || !end) {
    return NextResponse.json({ detail: "keyword, start, end are required" }, { status: 400 });
  }

  try {
    const raw = await googleTrends.interestOverTime({
      keyword,
      startTime: new Date(start),
      endTime: new Date(end),
      geo: "JP",
    });

    const parsed = JSON.parse(raw) as { default: { timelineData: TimelineItem[] } };
    const timelineData = parsed.default.timelineData;

    const data = timelineData.map((item) => ({
      date: new Date(parseInt(item.time) * 1000).toISOString().slice(0, 10),
      interest: item.value[0],
    }));

    return NextResponse.json({ keyword, data });
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 502 });
  }
}
