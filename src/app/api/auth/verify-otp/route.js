import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken'; // یا ذخیره ساده شماره موبایل / توکن

export async function POST(request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'شماره موبایل و کد تایید الزامی هستند.' },
        { status: 400 }
      );
    }

    // پیدا کردن کد ذخیره‌شده در دیتابیس
    const otpRecord = await prisma.otp.findUnique({ where: { phone } });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'کد تایید یافت نشد. ابتدا درخواست کد کنید.' },
        { status: 400 }
      );
    }

    // بررسی انقضای کد
    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json(
        { error: 'کد تایید منقضی شده است. لطفاً دوباره تلاش کنید.' },
        { status: 400 }
      );
    }

    // بررسی صحت کد
    if (otpRecord.code !== code) {
      return NextResponse.json(
        { error: 'کد تایید اشتباه است.' },
        { status: 400 }
      );
    }









    // کد درست است؛ حالا بررسی می‌کنیم آیا کاربر در جدول User وجود دارد یا خیر
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      // اگر کاربر جدید بود، ثبت‌نامش می‌کنیم
      user = await prisma.user.create({ data: {phone} });
    }

    // پاک کردن کد OTP استفاده‌شده
    await prisma.otp.delete({ where: { phone } });

    // اینجا می‌توانید در صورت نیاز کوکی (Cookie) یا توکن JWT بسازید و ست کنید
    // فعلاً اطلاعات کاربر را برمی‌گردانیم تا در فرانت‌اند استفاده کنید
    const token = jwt.sign({ userId: user.id, phone: user.phone }, process.env.JWT_SECRET || 'super-secret-key', {
      expiresIn: '7d',
    });

    const response = NextResponse.json(
      { 
        message: 'ورود با موفقیت انجام شد.',
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
        }
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true, // امنیت بالا برای جلوگیری از دسترسی جاوااسکریپت سمت کلاینت
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // ۷ روز
    });

    return response;

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'خطایی در سرور رخ داده است.' },
      { status: 500 }
    );
  }
}
