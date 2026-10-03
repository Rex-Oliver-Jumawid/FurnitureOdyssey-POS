import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const demoEmail = process.env.DEMO_USER_EMAIL?.trim();
  const demoPassword = process.env.DEMO_USER_PASSWORD;

  if (!demoEmail || !demoPassword) {
    return NextResponse.redirect(
      new URL("/login?error=demo-unavailable", request.url),
    );
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.headers.set("Cache-Control", "private, no-store");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email?.toLowerCase() === demoEmail.toLowerCase()) {
    return response;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: demoEmail,
    password: demoPassword,
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=demo-unavailable", request.url),
    );
  }

  return response;
}
