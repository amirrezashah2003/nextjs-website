import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    if (!tokenCookie) return null;
    
    const decoded = jwt.verify(tokenCookie.value, JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    
    if (userId !== 1) return null;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  } catch (error) {
    return null;
  }
}

// GET: دریافت لیست تمام کاربران سایت
export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        orders: true,
        addresses: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const serialized = JSON.parse(
      JSON.stringify(users, (k, v) => (typeof v === "bigint" ? v.toString() : v))
    );

    return NextResponse.json({ success: true, users: serialized });
  } catch (error) {
    console.error("GET ADMIN USERS ERROR:", error);
    return NextResponse.json({ error: "خطا در دریافت لیست کاربران" }, { status: 500 });
  }
}

// PUT: ویرایش اطلاعات کاربر (مثلا نام یا شماره تماس)
export async function PUT(request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, phone, name } = body;

    if (!id) {
      return NextResponse.json({ error: "شناسه کاربر الزامی است." }, { status: 400 });
    }

    // جلوگیری از ویرایش ادمین اصلی (آیدی 1) به شکل ناخواسته اگر نیاز باشد
    // if (Number(id) === 1) { ... }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        phone,
        name,
      },
      include: {
        orders: true,
        addresses: true,
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(updatedUser, (k, v) => (typeof v === "bigint" ? v.toString() : v))
    );

    return NextResponse.json({ success: true, message: "کاربر با موفقیت بروزرسانی شد.", user: serialized });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return NextResponse.json({ error: "خطا در ویرایش کاربر" }, { status: 500 });
  }
}

// DELETE: حذف کاربر
export async function DELETE(request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "شناسه کاربر الزامی است." }, { status: 400 });
    }

    const targetId = Number(id);

    // جلوگیری از حذف ادمین اصلی سیستم (آیدی 1)
    if (targetId === 1) {
      return NextResponse.json({ error: "امکان حذف مدیر کل سیستم وجود ندارد." }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: targetId },
    });

    return NextResponse.json({ success: true, message: "کاربر با موفقیت حذف شد." });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json({ error: "خطا در حذف کاربر" }, { status: 500 });
  }
}
