import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // مسیرهای مربوط به ادمین
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    try {
      // تبدیل سکرت به Uint8Array برای jose
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      const userId = payload.userId || payload.id;

      // بررسی ادمین بودن (تبدیل به عدد برای اطمینان از صحت نوع داده)
      if (Number(userId) !== 1) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.log("Middleware Token Verification Failed:", error.message);
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
