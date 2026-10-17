import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key"; 

async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    if (!tokenCookie) return null;
    return jwt.verify(tokenCookie.value, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// ثبت آدرس جدید
export async function POST(request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const userId = auth.userId || auth.id;
    const body = await request.json();
    const { title, city, street, postalCode, receiverName, receiverPhone } = body;

    if (!city || !street) {
      return NextResponse.json({ error: "شهر و خیابان الزامی هستند." }, { status: 400 });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        title: title || "منزل",
        city,
        street,
        postalCode: postalCode || null,
        receiverName: receiverName || null,
        receiverPhone: receiverPhone || null,
      },
    });

    return NextResponse.json({ success: true, message: "آدرس با موفقیت ثبت شد.", address: newAddress });
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    return NextResponse.json({ error: "خطا در ثبت آدرس." }, { status: 500 });
  }
}
