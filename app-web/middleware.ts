import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth is deliberately deferred. Route protection currently relies on the
 * session cookie set during onboarding; Clerk slots in here later without
 * changing any page or feature code.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest.webmanifest|sw.js).*)"],
};
