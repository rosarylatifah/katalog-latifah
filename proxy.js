import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Lindungi semua rute yang diawali dengan /admin kecuali /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const supabase = createServerClient();
    
    // Periksa sesi pengguna yang sedang aktif di server
    // Catatan: Jika menggunakan service role / secret key, kita bisa cek user via cookies/auth
    const { data: { session }, error } = await supabase.auth.getSession();

    // Jika tidak ada session / error, redirect ke /admin/login
    if (error || !session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};