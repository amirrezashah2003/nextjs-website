import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
// دقیقاً همان کلید پیش‌فرضی که در روت verify استفاده کرده‌اید
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key"; 

async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    
    if (!tokenCookie) return null;
    
    const decoded = jwt.verify(tokenCookie.value, JWT_SECRET);
    return decoded; // شامل userId و phone
  } catch (error) {
    console.error("Auth verification error:", error.message);
    return null;
  }
}

// 1. دریافت اطلاعات کامل پروفایل (اطلاعات حساب، سفارش‌ها، آدرس‌ها)
export async function GET(request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const userId = auth.userId || auth.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          include: {
            items: {
              include: { product: true }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        addresses: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد." }, { status: 404 });
    }

    // تبدیل BigInt ها به String برای جلوگیری از خطای سریالایز در JSON
    const serializedUser = JSON.parse(
      JSON.stringify(user, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ success: true, user: serializedUser });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return NextResponse.json({ error: "خطای سرور در دریافت اطلاعات پروفایل." }, { status: 500 });
  }
}

// 2. ویرایش اطلاعات حساب کاربری
export async function PUT(request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const userId = auth.userId || auth.id;
    const body = await request.json();
    const { name, email, nationalId } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || null,
        email: email || null,
        nationalId: nationalId || null,
      }
    });

    return NextResponse.json({ success: true, message: "اطلاعات با موفقیت بروزرسانی شد.", user: updatedUser });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی اطلاعات." }, { status: 500 });
  }
}
