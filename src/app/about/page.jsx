import React from "react";
import AboutGallery from "@/components/AboutGallery/AboutGallery";
import { 
  FaCode, FaServer, FaDatabase, FaShieldAlt, FaBolt, 
  FaLaptopCode, FaCheckCircle, FaLayerGroup, FaRocket, 
  FaShoppingCart, FaUserShield, FaLightbulb 
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-tertiary text-gray-900 in-[.dark]:text-gray-100 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* ================= بخش اول: گالری چرخنده تصاویر و معرفی کوتاه ================= */}
        <section className="text-center space-y-8">
            
            {/* فراخوانی کامپوننت کلاینتِ گالری */}
            <AboutGallery />

            {/* ================= عنوان و مقدمه ================= */}
            <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  معماری و روایت فنی <span className="text-primary">پروژه</span>
                </h2>
                <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-600 in-[.dark]:text-gray-300 leading-relaxed">
                  سلام، من <span className="font-semibold text-primary">امیررضا</span> هستم؛ توسعه‌دهنده فرانت‌اند و سازنده سامانه‌های وب مقیاس‌پذیر. تمرکز من فقط بر اجرای طرح‌ها نیست؛ روی مهندسی یک محصول کامل است: مسیر کاربر، ساختار داده، سرعت نمایش، امنیت مسیرهای حساس و تجربه‌ای که در موبایل و دسکتاپ یکسان و روان بماند.
                </p>
                <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-500 in-[.dark]:text-gray-400 leading-relaxed">
                  در پروژه‌ای که این سند بر اساس آن نوشته شده، یک فروشگاه اینترنتی واقعی را از صفر ساخته‌ام — از معماری پایه و سیستم طراحی گرفته تا لایه داده، احراز هویت، سبد خرید ترکیبی مهمان/کاربر و پنل مدیریت. این صفحه را طوری تنظیم کرده‌ام که هر کارفرما یا تک‌لیدری بتواند در چند دقیقه تصویر دقیقی از توانایی فنی و نحوه نگرش من به کیفیت پیدا کند.
                </p>
                <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-500 in-[.dark]:text-gray-400 leading-relaxed">
                  برای مشاهده دقیق تر ساختار پروژه و تکنولوژی های استفاده شده وارد <a className="inline-flex justify-center text-primary! font-bold underline! underline-offset-8! mx-1" href="https://github.com/amirrezashah2003/nextjs-website"> گیت هاب </a> من شوید.
                </p>
            </div>
        </section>

        {/* ================= بخش دوم: مهارت‌های تخصصی ================= */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold border-b pb-3 border-gray-200 in-[.dark]:border-gray-800 flex items-center gap-2">
            <FaLaptopCode className="text-primary" /> مهارت‌ها و تکنولوژی‌های تخصصی
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "Next.js (App Router)", desc: "SSR, SSG, Route Handlers, Middleware", icon: <FaRocket /> },
              { title: "React & State Management", desc: "React Query (TanStack), Context, Custom Hooks", icon: <FaCode /> },
              { title: "Styling & UI", desc: "Tailwind CSS v4, Responsive Design, CSS Variables", icon: <FaLayerGroup /> },
              { title: "Database & Backend", desc: "Prisma ORM, SQLite, API Design, JWT Auth", icon: <FaDatabase /> },
              { title: "JavaScript & Ecosystem", desc: "ES6+, Axios, Swiper.js, Next-Themes", icon: <FaServer /> },
              { title: "Security & Performance", desc: "Edge Runtime (jose), HTTP-only Cookies, Hydration Fixes", icon: <FaShieldAlt /> },
            ].map((skill, index) => (
              <div 
                key={index} 
                className="bg-white in-[.dark]:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 in-[.dark]:border-gray-700 hover:shadow-md transition space-y-3"
              >
                <div className="text-3xl text-primary">{skill.icon}</div>
                <h3 className="font-bold text-lg">{skill.title}</h3>
                <p className="text-sm text-gray-600 in-[.dark]:text-gray-400">{skill.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= بخش سوم: توضیحات تخصصی معماری و پروژه فروشگاهی ================= */}
        <section className="space-y-6 bg-white in-[.dark]:bg-gray-800/50 p-6 sm:p-8 rounded-3xl border border-gray-200 in-[.dark]:border-gray-700 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaBolt className="text-primary" /> معماری و قابلیت‌های وب‌سایت فروشگاهی (پروژه شاخص)
            </h2>
            <p className="text-gray-600 in-[.dark]:text-gray-400 text-sm leading-relaxed">
              این وب‌سایت یک فروشگاه اینترنتی برای عرضه و مدیریت محصولات دیجیتال است که با هدف ساخت تجربه‌ای روان، قابل‌اعتماد و توسعه‌پذیر طراحی و پیاده‌سازی شده است. در این پروژه، تمرکز من فقط بر نمایش صفحات نبوده؛ تلاش کرده‌ام مسیر کامل کاربر، از پیدا کردن محصول و بررسی جزئیات آن تا ورود، مدیریت سبد خرید و ثبت اطلاعات حساب کاربری، منسجم و قابل‌استفاده باشد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">مدیریت داده‌ها و پایگاه داده مدرن</h4>
                  <p className="text-sm text-gray-600 in-[.dark]:text-gray-400">مهاجرت از JSON Server به SQLite با استفاده از Prisma ORM و اسکریپت‌های Seed سفارشی برای پایداری و سازماندهی مدل‌های داده.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">سیستم احراز هویت امن (OTP & JWT)</h4>
                  <p className="text-sm text-gray-600 in-[.dark]:text-gray-400">پیاده‌سازی ورود پیامکی امن، کوکی‌های HTTP-only و اعتبارسنجی در سطح Edge با پکیج سازگار `jose` در Middleware.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">سبد خرید هوشمند (Guest & Authenticated Sync)</h4>
                  <p className="text-sm text-gray-600 in-[.dark]:text-gray-400">قابلیت نگهداری سبد خرید مهمان در LocalStorage و ادغام خودکار آن با دیتابیس پس از لاگین کاربر با استفاده از تراکنش‌های Prisma.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">کارایی و بهینه‌سازی رندرینگ</h4>
                  <p className="text-sm text-gray-600 in-[.dark]:text-gray-400">استفاده از TanStack React Query برای کش‌کردن درخواست‌ها، پیش‌بارگذاری داده‌ها و رفع کامل ناسازگاری‌های SSR/Client Hydration.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">طراحی واکنش‌گرا و in-[.dark]/Light Mode</h4>
                  <p className="text-sm text-gray-600 in-[.dark]:text-gray-400">پشتیبانی کامل از تم‌های روشن و تاریک با `next-themes`، متغیرهای CSS سفارشی و ساختار کاملاً Responsive بر اساس Tailwind CSS v4.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">پنل مدیریت پیشرفته و کنترل دسترسی</h4>
                  <p className="text-sm text-gray-600 in-[.dark]:text-gray-400">پنل ادمین اختصاصی با قابلیت مدیریت محصولات و کاربران، تفکیک نقش‌ها و اعتبارسنجی امن مسیرها در سمت سرور.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= بخش پایانی: قابلیت‌ها و چرا من ================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 text-gray-900 in-[.dark]:text-gray-100">
          
          {/* قابلیت‌های کلیدی محصول */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2 border-b pb-3 border-gray-200 in-[.dark]:border-gray-800">
              <FaShoppingCart className="text-primary" /> قابلیت‌های کلیدی محصول
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white in-[.dark]:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 in-[.dark]:border-gray-700 space-y-2">
                <FaUserShield className="text-2xl text-primary" />
                <h4 className="font-bold">احراز هویت امن با OTP</h4>
                <p className="text-xs text-gray-600 in-[.dark]:text-gray-400">ورود با رمز یک‌بارمصرف، مدیریت نشست با توکن JWT و کوکی‌های httpOnly و خروج ایمن در سمت سرور.</p>
              </div>

              <div className="bg-white in-[.dark]:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 in-[.dark]:border-gray-700 space-y-2">
                <FaShieldAlt className="text-2xl text-primary" />
                <h4 className="font-bold">Middleware سازگار با Edge</h4>
                <p className="text-xs text-gray-600 in-[.dark]:text-gray-400">محافظت از مسیرهای حساس با کتابخانه jose برای اعتبارسنجی JWT و تشخیص نقش ادمین در نقطه ورود درخواست‌ها.</p>
              </div>

              <div className="bg-white in-[.dark]:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 in-[.dark]:border-gray-700 space-y-2">
                <FaShoppingCart className="text-2xl text-primary" />
                <h4 className="font-bold">سبد خرید ترکیبی</h4>
                <p className="text-xs text-gray-600 in-[.dark]:text-gray-400">نگهداری سبد مهمان در localStorage و ادغام خودکار آن با دیتابیس پس از ورود با تراکنش‌های امن Prisma.</p>
              </div>

              <div className="bg-white in-[.dark]:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 in-[.dark]:border-gray-700 space-y-2">
                <FaLaptopCode className="text-2xl text-primary" />
                <h4 className="font-bold">پنل مدیریت اختصاصی</h4>
                <p className="text-xs text-gray-600 in-[.dark]:text-gray-400">مدیریت محصولات و کاربران با تفکیک نقش‌ها، تب‌های پویا و اتصال مستقیم به APIهای اختصاصی.</p>
              </div>
            </div>
          </div>

          {/* چرا من؟ */}
          <div className="space-y-6 bg-white in-[.dark]:bg-gray-800/80 p-6 sm:p-8 rounded-3xl border border-gray-200 in-[.dark]:border-gray-700 shadow-sm">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <FaLightbulb className="text-primary" /> چرا من؟
            </h3>
            <p className="text-sm sm:text-base text-gray-600 in-[.dark]:text-gray-300">
              اگر به‌دنبال کسی هستید که فقط صفحات زیبا نسازد، بلکه مسئول معماری، کیفیت و رفتار واقعی محصول باشد، این پروژه نشان می‌دهد که چگونه کار می‌کنم:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">نگرش محصولی</h4>
                  <p className="text-xs text-gray-600 in-[.dark]:text-gray-400">از نیاز کاربر شروع می‌کنم، نه از کتابخانه.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">تصمیم‌های فنی دلیل‌دار</h4>
                  <p className="text-xs text-gray-600 in-[.dark]:text-gray-400">هر انتخاب بر اساس نیاز واقعی و قابل توضیح بوده است، نه مد روز بودن.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">توجه به جزئیات بی‌صدا</h4>
                  <p className="text-xs text-gray-600 in-[.dark]:text-gray-400">مدیریت خطا، هماهنگی داده، امنیت مسیرها و ناسازگاری هیدریشن.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">کد قابل تحویل به تیم</h4>
                  <p className="text-xs text-gray-600 in-[.dark]:text-gray-400">ساختاری تمیز، هوک‌های قابل استفاده مجدد و الگوهای یکدست.</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 in-[.dark]:text-gray-300 pt-2 border-t border-gray-200 in-[.dark]:border-gray-700">
              این پروژه نشان می‌دهد که می‌توانم از ایده تا محصول کامل را مستقل ببرم و در تیم نیز با همین نگرش کیفیت‌محور contribution مؤثر داشته باشم. آماده‌ام در یک مصاحبه کوتاه یا بررسی کد، جزئیات فنی هر بخش را دقیق توضیح دهم.
            </p>
          </div>

        </section>

      </div>
    </div>
  );
}
