import { NextResponse, type NextRequest } from "next/server";

export async function middleware(_request: NextRequest) {
  // Security and role gating intentionally disabled for rapid iteration.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
