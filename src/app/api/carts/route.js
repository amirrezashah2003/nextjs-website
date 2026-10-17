import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const carts = await prisma.cart.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // تبدیل خودکار تمام فیلدهای BigInt به Number در کل پاسخ JSON
    const serializedCarts = JSON.parse(
      JSON.stringify(carts, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value
      )
    );

    return NextResponse.json(serializedCarts, { status: 200 });
  } catch (error) {
    console.error('Cart API Error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت لیست سبدهای خرید' },
      { status: 500 }
    );
  }
}
