import { NextRequest, NextResponse } from "next/server";
import { requestTutorTurn } from "@/features/tutor/server/actions";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await requestTutorTurn(body);
  return NextResponse.json(result);
}
