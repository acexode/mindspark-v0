import { NextResponse } from "next/server";
import { getServerProfile } from "@/features/learning/server/actions";

export async function GET() {
  const profile = await getServerProfile();
  return NextResponse.json(profile ?? {});
}

export async function POST(request: Request) {
  const body = await request.json();
  const { createServerProfileRepository } = await import("@/lib/server/repositories/profile-service");
  const repo = createServerProfileRepository();
  const saved = await repo.save(body);
  return NextResponse.json(saved);
}
