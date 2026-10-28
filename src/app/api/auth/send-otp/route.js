import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { phone } = await request.json();

    if (!phone || typeof phone !== 'string' || !/^09\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'شماره موبایل معتبر نیست.' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.MELIPAYAMAK_OTP_URL || "xxxx"

    if (!apiUrl) {
      console.error('MELIPAYAMAK_OTP_URL is not configured in environment variables.');
      return NextResponse.json(
        { error: 'سرویس ارسال پیامک تنظیم نشده است.' },
        { status: 500 }
      );
    }

    // ارسال درخواست به وب‌سرویس اختصاصی OTP ملی‌پیامک
    const smsResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: phone }),
      cache: 'no-store',
    });

    const result = await smsResponse.json().catch(() => null);


    if (!smsResponse.ok || !result?.code) {
      console.error('Melipayamak OTP error response:', result);
      return NextResponse.json(
        { error: 'ارسال پیامک با خطا مواجه شد. لطفاً دوباره تلاش کنید.' },
        { status: 502 }
      );
    }

    const otpCode = String(result.code);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // انقضا تا ۲ دقیقه

    // ذخیره یا آپدیت کد تولید شده توسط پنل در دیتابیس
    await prisma.otp.upsert({
      where: { phone },
      update: { code: otpCode, expiresAt },
      create: { phone, code: otpCode, expiresAt },
    });

    return NextResponse.json(
      { message: 'کد تایید با موفقیت ارسال شد.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in send-otp route:', error);
    return NextResponse.json(
      { error: 'خطایی در سرور رخ داده است.' },
      { status: 500 }
    );
  }
}
