import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// تابع کمکی برای سریالایز کردن BigInt
function serialize(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// GET: دریافت سبد خرید یک کاربر
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const userId = Number(id);

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], userId }, { status: 200 });
    }

    return NextResponse.json(serialize(cart), { status: 200 });
  } catch (error) {
    console.error("GET Cart Error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سبد خرید", details: error.message },
      { status: 500 }
    );
  }
}

// POST: افزودن محصول به سبد خرید
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "شناسه کاربر معتبر نیست" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const productId = Number(body.productId);
    const quantity = Number(body.quantity ?? 1);

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { error: "شناسه محصول معتبر نیست" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "تعداد باید عدد صحیح بزرگ‌تر از صفر باشد" },
        { status: 400 }
      );
    }

    // بررسی وجود کاربر
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "کاربر پیدا نشد" },
        { status: 404 }
      );
    }

    // دریافت محصول برای استخراج قیمت
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    // پیدا کردن یا ساخت سبد خرید کاربر
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // بررسی وجود محصول در سبد
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price:
            typeof product.price === "bigint"
              ? product.price
              : BigInt(product.price),
        },
      });
    }

    // دریافت سبد به‌روز‌شده
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(serialize(updatedCart), { status: 200 });
  } catch (error) {
    console.error("POST Cart Error:", error);
    return NextResponse.json(
      { error: "خطا در افزودن محصول به سبد خرید", details: error.message },
      { status: 500 }
    );
  }
}

// PUT: آپدیت تعداد یک آیتم از سبد خرید
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const itemId = Number(id); // در PUT و DELETE این id همان itemId است

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "شناسه آیتم نامعتبر است" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const quantity = Number(body.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "تعداد باید عدد صحیح و حداقل ۱ باشد" },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
      },
    });

    return NextResponse.json(serialize(updatedItem), { status: 200 });
  } catch (error) {
    console.error("PUT CartItem Error:", error);
    return NextResponse.json(
      { error: "خطا در ویرایش تعداد آیتم", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: حذف یک آیتم از سبد خرید
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const itemId = Number(id);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "شناسه آیتم نامعتبر است" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json(
      { message: "آیتم با موفقیت حذف شد", id: itemId },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE CartItem Error:", error);
    return NextResponse.json(
      { error: "خطا در حذف آیتم سبد خرید", details: error.message },
      { status: 500 }
    );
  }
}
