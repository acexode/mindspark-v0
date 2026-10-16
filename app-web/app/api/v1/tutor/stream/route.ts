import { NextResponse, type NextRequest } from "next/server";
import { buildTutorContext } from "@/features/tutor/server/context";
import { tutorRequestSchema } from "@/features/tutor/server/request";
import { streamTutorTurn } from "@/lib/server/ai/tutor";

/** Streams the reply as plain text; the provider that answered is reported in `x-tutor-source`. */
export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = tutorRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid tutor request" }, { status: 400 });

  const { source, promptVersion, stream } = await streamTutorTurn(await buildTutorContext(parsed.data));
  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-tutor-source": source,
      "x-tutor-prompt-version": promptVersion,
    },
  });
}
