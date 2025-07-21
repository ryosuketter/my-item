import { NextResponse } from "next/server";
import { getCategories } from "@/lib/microcms";

export async function GET() {
  const res = await getCategories();
  return NextResponse.json(res);
}
