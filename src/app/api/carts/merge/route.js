import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "your-fallback-secret-key";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { items = [], userId: bodyUserId, token: bodyToken } = body;

    let targetUserId = bodyUserId;

    // ۱. بررسی احراز هویت (کوکی یا توکن ارسالی در بادی)
    if (!targetUserId) {
      const cookieStore = await cookies();
      const authToken = cookieStore.get("auth_token")?.value || cookieStore.get("token")?.value || bodyToken;

      if (authToken) {
        try {
          const decoded = jwt.verify(authToken, JWT_SECRET);
          targetUserId = decoded?.id || decoded?.userId;
        } catch (jwtErr) {
          console.warn("JWT verify warning:", jwtErr.message);
        }
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: "کاربر احراز هویت نشده است." },
        { status: 401 }
      );
    }

    const numericUserId = Number(targetUserId);

    // ۲. یافتن یا ساختن سبد خرید کاربر
    let userCart = await prisma.cart.findFirst({
      where: { userId: numericUserId },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId: numericUserId },
      });
    }

    // اگر سبد مهمان خالی بود، فقط سبد فعلی رو برگردون
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: true, message: "سبد مهمان خالی بود." });
    }

    // ۳. ادغام آیتم‌ها در تراکنش دیتابیس
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const pId = Number(item.productId || item.id);
        const qty = Number(item.quantity || 1);

        if (!pId) continue;

        // دریافت اطلاعات محصول برای استخراج قیمت دقیق
        const product = await tx.product.findUnique({
          where: { id: pId },
          select: { price: true },
        });

        // تعیین قیمت (اولویت: قیمت محصول در دیتابیس، سپس قیمت ارسالی از سبد مهمان)
        const rawPrice = product?.price ?? item.price ?? 0;
        const itemPrice = typeof rawPrice === "bigint" ? rawPrice : BigInt(Math.round(Number(rawPrice)));

        // بررسی وجود آیتم در سبد خرید کاربر
        const existingItem = await tx.cartItem.findFirst({
          where: {
            cartId: userCart.id,
            productId: pId,
          },
        });

        if (existingItem) {
          // افزایش تعداد در صورت وجود
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: {
              quantity: existingItem.quantity + qty,
            },
          });
        } else {
          // درج آیتم جدید به همراه فیلد price
          await tx.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: pId,
              quantity: qty,
              price: itemPrice, // حل ارور Argument price is missing
            },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "سبد خرید با موفقیت ادغام شد.",
    });

  } catch (error) {
    console.error("Merge API Error:", error);
    return NextResponse.json(
      { error: "خطا در ادغام سبد خرید" },
      { status: 500 }
    );
  }
}
