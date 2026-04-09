import { NextResponse } from "next/server";
import { COMPANY_MAP } from "@/lib/config";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const company = COMPANY_MAP[id];
  if (!company) {
    return NextResponse.json({ detail: "Company not found" }, { status: 404 });
  }
  return NextResponse.json(company.games);
}
