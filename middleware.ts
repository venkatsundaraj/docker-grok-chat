import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Runs on every request
export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  console.log("hello", session);
  const isLoggedIn = !!session?.user;
  const url = req.nextUrl.pathname;

  // Prevent logged-in users from seeing login/register
  if (isLoggedIn && (url === "/login" || url === "/sign-in")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Prevent logged-out users from seeing dashboard
  if (!isLoggedIn && url.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Define which paths should be checked
export const config = {
  matcher: ["/login", "/sign-in", "/dashboard/:path*"],
};
