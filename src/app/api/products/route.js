import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: دریافت لیست محصولات (با پشتیبانی از فیلتر دسته‌بندی)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // استخراج تمام پارامترهای احتمالی از URL
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');

    // ساخت شیء فیلتر پویا (Where Clause برای Prisma)
    const filters = {};

    if (id) {
      filters.id = Number(id); // چون id در دیتابیس Int است
    }
    if (category) {
      filters.category = category;
    }
    if (brand) {
      filters.brand = brand;
    }
    if (model) {
      filters.model = model;
    }

    // دریافت اطلاعات از دیتابیس با اعمال فیلترها
    const products = await prisma.product.findMany({
      where: filters,
    });

    // تبدیل BigInt به Number برای جلوگیری از خطای سریالایز شدن
    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات از دیتابیس' },
      { status: 500 }
    );
  }
}

// POST: افزودن محصول جدید (اگر در هوکتان نیاز دارید)
export async function POST(request) {
  try {
    const body = await request.json();

    const newProduct = await prisma.product.create({
      data: {
        category: body.category,
        brand: body.brand,
        model: body.model,
        name: body.name,
        price: body.price,
        info: body.info,
        img: body.img,
      },
    });

    return NextResponse.json({
      ...newProduct,
      price: Number(newProduct.price),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'خطا در ثبت محصول' },
      { status: 500 }
    );
  }
}