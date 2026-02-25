import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const teacherOnly = ["/teacher"];
const studentOnly = ["/student", "/practice"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const path = request.nextUrl.pathname;
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/login") ||
    path === "/"
  ) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (teacherOnly.some((prefix) => path.startsWith(prefix))) {
    if (profile?.role !== "teacher") {
      const url = request.nextUrl.clone();
      url.pathname = "/student";
      return NextResponse.redirect(url);
    }
  }

  if (studentOnly.some((prefix) => path.startsWith(prefix))) {
    if (profile?.role !== "student") {
      const url = request.nextUrl.clone();
      url.pathname = "/teacher";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
