import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/onboarding", "/sign-in", "/sign-up", "/api/health"];
const studentPaths = ["/home", "/diagnostic", "/learn", "/practice", "/knowledge-map", "/progress", "/library", "/quests", "/league", "/tutor"];

function isPublic(pathname: string) {
  return publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isStudentRoute(pathname: string) {
  return studentPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

async function runClerkMiddleware(request: NextRequest) {
  if (!process.env.CLERK_SECRET_KEY) return null;
  const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server");
  const isPublicRoute = createRouteMatcher(["/", "/onboarding(.*)", "/sign-in(.*)", "/sign-up(.*)", "/api/health(.*)"]);
  return clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) await auth.protect();
    return NextResponse.next();
  })(request, {} as never);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  const clerkResult = await runClerkMiddleware(request);
  if (clerkResult) return clerkResult;

  if (isStudentRoute(pathname) && !isPublic(pathname)) {
    const profileCookie = request.cookies.get("mindspark-dev-profile");
    const onboarded = profileCookie?.value?.includes('"onboarded":true');
    if (!onboarded && !pathname.startsWith("/onboarding") && !pathname.startsWith("/diagnostic")) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
