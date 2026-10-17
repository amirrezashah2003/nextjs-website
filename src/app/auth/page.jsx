'use client';

import { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function AuthPage() {
    const [step, setStep] = useState('phone'); // 'phone' یا 'otp'
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const searchParams = useSearchParams(); // ۲. تعریف searchParams
    const callbackUrl = searchParams.get('callback') || '/'; // ۳. خواندن پارامتر callback یا پیش‌فرض خانه



    // تابع اعتبارسنجی شماره موبایل ایران
    const validateIranianPhone = (phoneNumber) => {
        const phoneRegex = /^09[0-9]{9}$/;
        return phoneRegex.test(phoneNumber);
    };


  // مرحله ۱: ارسال شماره موبایل
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateIranianPhone(phone)) {
      setError('شماره تلفن معتبر نیست. (مثال: 09123456789)');
      return;
    }


    setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', { phone });
      setStep('otp'); // رفتن به مرحله وارد کردن کد
    } catch (err) {
      setError(err.response?.data?.error || 'خطایی رخ داد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  // مرحله ۲: تایید کد OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ۱. تایید کد و دریافت پاسخ
      const response = await axios.post('/api/auth/verify-otp', { phone, code: otp });

      // ۲. بررسی و انتقال سبد خرید مهمان (Guest Cart) به دیتابیس
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      
      if (guestCart.length > 0) {
        try {
          // استخراج userId و توکن احتمالی از خروجی لاگین جهت دور زدن تاخیر ست شدن کوکی
          const userId = response.data?.user?.id || response.data?.userId;
          const userToken = response.data?.token || response.data?.accessToken;

          await axios.post(
            '/api/carts/merge',
            { 
              items: guestCart,
              userId: userId,
              token: userToken
            },
            { withCredentials: true } // حیاتی برای ارسال کوکی لاگین به سرور
          );
          
          // پاک کردن سبد مهمان از لوکال‌استوریج پس از انتقال موفق
          localStorage.removeItem('guest_cart');
        } catch (syncErr) {
          console.error('Failed to sync guest cart on login:', syncErr);
        }
      }

      alert(response.data.message || 'با موفقیت وارد شدید!');
      window.location.href = decodeURIComponent(callbackUrl);
      
    } catch (err) {
      setError(err.response?.data?.error || 'کد وارد شده اشتباه است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm in-[.dark]:border-neutral-800 in-[.dark]:bg-neutral-900">
        
        {/* هدر باکس ورود */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold in-[.dark]:text-white">
            {step === 'phone' ? 'ورود | ثبت‌نام' : 'تایید کد تایید'}
          </h1>
          <p className="mt-2 text-sm text-neutral-500 in-[.dark]:text-neutral-400">
            {step === 'phone' 
              ? 'لطفاً شماره موبایل خود را وارد کنید' 
              : `کد تایید به شماره ${phone} ارسال شد.`}
          </p>
        </div>

        {/* نمایش خطا */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600 in-[.dark]:bg-red-900/30 in-[.dark]:text-red-400">
            {error}
          </div>
        )}

        {/* فرم مرحله ۱: شماره موبایل */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-neutral-700 in-[.dark]:text-neutral-300">شماره موبایل</label>
              <input
                type="tel"
                placeholder="09123456789"
                className="w-full rounded-xl border border-neutral-300 p-3 outline-none focus:ring-1 focus:ring-primary-hover in-[.dark]:border-neutral-700 in-[.dark]:bg-neutral-800 in-[.dark]:text-white"
                value={phone}
                onChange={(e) => { setPhone(e.target.value);  if (error) setError('');} }
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary-hover p-3 font-semibold text-white transition hover:bg-primary disabled:opacity-50"
            >
              {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
            </button>
          </form>
        ) : (
          /* فرم مرحله ۲: کد OTP */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-neutral-700 in-[.dark]:text-neutral-300">کد ۴ رقمی</label>
              <input
                type="text"
                maxLength="4"
                placeholder="****"
                className="w-full rounded-xl border border-neutral-300 p-3 text-center text-2xl tracking-[1em] outline-none focus:ring-1 focus:ring-primary-hover in-[.dark]:border-neutral-700 in-[.dark]:bg-neutral-800 in-[.dark]:text-white"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary-hover p-3 font-semibold text-white transition hover:bg-primary disabled:opacity-50"
            >
              {loading ? 'در حال بررسی...' : 'تایید و ورود'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-sm text-neutral-500 hover:underline in-[.dark]:text-neutral-400"
            >
              ویرایش شماره موبایل
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
