import { NextResponse } from "next/server";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export async function GET() {
  return NextResponse.json(await readProfileOrDefault());
}
