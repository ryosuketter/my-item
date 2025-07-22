import { NextResponse } from "next/server";
import { getProducts } from "@/lib/microcms";

export async function GET() {
  const res = await getProducts({ limit: 100 });
  return NextResponse.json(res);
}
