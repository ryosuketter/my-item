import { NextResponse } from "next/server";
import { getProduct } from "@/lib/microcms";

export async function GET(request, { params }) {
  const { id } = params;
  const res = await getProduct(id);
  return NextResponse.json(res);
}
