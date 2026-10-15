import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
  // سرور به راحتی می‌تواند کوکی HttpOnly را با maxAge: 0 پاک کند
    cookieStore.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
        maxAge: 0,
    });

  return NextResponse.json({ success: true, message: "خروج موفقیت‌آمیز" });
}
