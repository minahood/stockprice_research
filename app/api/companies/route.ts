import { NextResponse } from "next/server";
import { COMPANIES } from "@/lib/config";

export async function GET() {
  return NextResponse.json(
    COMPANIES.map((c) => ({ id: c.id, name: c.name, ticker: c.ticker }))
  );
}
