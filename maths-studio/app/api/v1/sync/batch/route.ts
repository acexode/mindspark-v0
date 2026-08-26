import { NextRequest, NextResponse } from "next/server";
import { getServerProfile } from "@/features/learning/server/actions";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const profile = await getServerProfile();

  return NextResponse.json({
    synced: true,
    profile: profile ?? null,
    queuedAttempts: payload.attempts ?? [],
    conflicts: [],
  });
}
