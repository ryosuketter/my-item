import { NextResponse } from "next/server";
import { getProducts } from "@/lib/microcms";

export async function GET() {
  const res = await getProducts();
  return NextResponse.json(res);
}
