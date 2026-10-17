import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// تابع کمکی بررسی دسترسی ادمین (فقط آیدی 1)
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

// GET: دریافت لیست محصولات برای ادمین
export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const products = await prisma.product.findMany({ orderBy: { id: "desc" } });
    
    // تبدیل BigInt به String برای جلوگیری از خطای سریالایز در Next.js
    const serialized = JSON.parse(
      JSON.stringify(products, (k, v) => (typeof v === "bigint" ? v.toString() : v))
    );

    return NextResponse.json({ success: true, products: serialized });
  } catch (error) {
    console.error("GET ADMIN PRODUCTS ERROR:", error);
    return NextResponse.json({ error: "خطا در دریافت محصولات" }, { status: 500 });
  }
}

// POST: افزودن محصول جدید
export async function POST(request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { category, brand, model, name, price, info, img } = body;

    const newProduct = await prisma.product.create({
      data: {
        category,
        brand,
        model,
        name,
        price: BigInt(price || 0),
        info,
        img,
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(newProduct, (k, v) => (typeof v === "bigint" ? v.toString() : v))
    );

    return NextResponse.json({ success: true, message: "محصول با موفقیت ایجاد شد.", product: serialized });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json({ error: "خطا در ایجاد محصول" }, { status: 500 });
  }
}

// PUT: ویرایش محصول
export async function PUT(request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, category, brand, model, name, price, info, img } = body;

    if (!id) {
      return NextResponse.json({ error: "شناسه محصول الزامی است." }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        category,
        brand,
        model,
        name,
        price: price !== undefined ? BigInt(price) : undefined,
        info,
        img,
      },
    });

    const serialized = JSON.parse(
      JSON.stringify(updatedProduct, (k, v) => (typeof v === "bigint" ? v.toString() : v))
    );

    return NextResponse.json({ success: true, message: "محصول با موفقیت بروزرسانی شد.", product: serialized });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json({ error: "خطا در ویرایش محصول" }, { status: 500 });
  }
}

// DELETE: حذف محصول
export async function DELETE(request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "شناسه محصول الزامی است." }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: "محصول با موفقیت حذف شد." });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json({ error: "خطا در حذف محصول" }, { status: 500 });
  }
}
