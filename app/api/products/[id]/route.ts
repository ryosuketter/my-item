import { NextResponse } from "next/server";
import { getProduct } from "@/lib/microcms";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const res = await getProduct(id);
  return NextResponse.json(res);
}
