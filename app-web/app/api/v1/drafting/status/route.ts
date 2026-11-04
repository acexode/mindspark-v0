import { NextResponse } from "next/server";
import { draftingStatus } from "@/lib/server/drafting/python";

export function GET() {
  return NextResponse.json(draftingStatus());
}
