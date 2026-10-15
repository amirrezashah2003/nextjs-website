import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || typeof phone !== 'string' || phone.length < 10) {
      return NextResponse.json(
        { error: 'شماره موبایل معتبر نیست.' },
        { status: 400 }
      );
    }

    // تولید کد تصادفی ۴ رقمی
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // تاریخ انقضا: ۲ دقیقه بعد
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    // ذخیره یا آپدیت کد در دیتابیس
    await prisma.otp.upsert({
      where: { phone },
      update: {
        code: otpCode,
        expiresAt,
      },
      create: {
        phone,
        code: otpCode,
        expiresAt,
      },
    });

    // چاپ کد در کنسول برای تست در محیط توسعه
    console.log(`========================================`);
    console.log(`[OTP SERVICE] Code for ${phone}: ${otpCode}`);
    console.log(`========================================`);

    return NextResponse.json(
      { message: 'کد تایید با موفقیت ارسال شد.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'خطایی در سرور رخ داده است.' },
      { status: 500 }
    );
  }
}
