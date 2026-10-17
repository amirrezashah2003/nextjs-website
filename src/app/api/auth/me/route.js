import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(
      tokenCookie.value,
      process.env.JWT_SECRET || "super-secret-key"
    );

    // توکن را بررسی کن و آیدی را بفرست
    // اگر در توکن userId ذخیره کردی decoded.userId است، اگر id ذخیره کردی decoded.id
    const userId = decoded.userId || decoded.id;

    return NextResponse.json(
      {
        user: {
          id: userId,
          phone: decoded.phone,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
