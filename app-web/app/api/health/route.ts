import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    version: "0.2.0",
    database: Boolean(process.env.DATABASE_URL),
    auth: Boolean(process.env.CLERK_SECRET_KEY),
    ai: Boolean(process.env.OPENAI_API_KEY),
  });
}
