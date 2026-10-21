import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const LIMIT = 12; // حداکثر محصول در هر صفحه

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    const page = parseInt(searchParams.get('page') || '1', 10);

    const filters = {};

    if (id) filters.id = Number(id);
    if (category) filters.category = category;
    if (brand) filters.brand = brand;
    if (model) filters.model = model;

    // تعداد کل محصولات با همین فیلترها (برای محاسبه تعداد صفحات)
    const totalItems = await prisma.product.count({ where: filters });

    const products = await prisma.product.findMany({
      where: filters,
      skip: (page - 1) * LIMIT,
      take: LIMIT,
      orderBy: { id: 'asc' }, // ترتیب ثابت تا صفحات جابه‌جا نشوند
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));

    return NextResponse.json({
      products: formattedProducts,
      totalPages: Math.ceil(totalItems / LIMIT),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات از دیتابیس' },
      { status: 500 }
    );
  }
}
