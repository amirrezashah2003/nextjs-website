"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { 
  HiOutlineUser, 
  HiOutlineShoppingBag, 
  HiOutlineLocationMarker, 
  HiOutlineLogout, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiOutlineLogin 
} from "react-icons/hi";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // فرم ویرایش اطلاعات
  const [formData, setFormData] = useState({ name: "", email: "", nationalId: "" });
  const [saving, setSaving] = useState(false);


 // فرم افزودن آدرس جدید
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: "منزل",
    city: "",
    street: "",
    postalCode: "",
    receiverName: "",
    receiverPhone: ""
  });
  const [addingAddress, setAddingAddress] = useState(false);



  // دریافت اطلاعات کاربر
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/profile", { 
        withCredentials: true,
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });
      
      // بررسی دقیق ساختار پاسخ API
      if (res.data && (res.data.success || res.data.user)) {
        const userObj = res.data.user || res.data;
        setUserData(userObj);
        setFormData({
          name: userObj.name || "",
          email: userObj.email || "",
          nationalId: userObj.nationalId || ""
        });
        setNotLoggedIn(false);
      } else {
        setNotLoggedIn(true);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      // اگر خطای احراز هویت بود یا پاسخ 401/403 دریافت شد
      if (err.response?.status === 401 || err.response?.status === 403) {
        setNotLoggedIn(true);
      } else {
        // برای خطاهای دیگر، اگر قبلاً توکن یا لاگین داشتیم، خیلی سریع نگوییم لاگین نیست
        // مگر اینکه سرور رسماً بگوید احراز هویت ناموفق است.
        toast.error(err.response?.data?.message || "خطا در دریافت اطلاعات پروفایل");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ذخیره تغییرات پروفایل
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put("/api/profile", formData, { withCredentials: true });
      if (res.data.success) {
        toast.success("اطلاعات با موفقیت ذخیره شد");
        fetchProfile();
      }
    } catch (err) {
      toast.error("خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };



    // تابع ارسال فرم آدرس را اضافه کنید
      const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddingAddress(true);
    try {
      const res = await axios.post("/api/addresses", addressForm, { withCredentials: true });
      if (res.data.success) {
        toast.success("آدرس جدید با موفقیت ثبت شد");
        setShowAddressModal(false);
        setAddressForm({ title: "منزل", city: "", street: "", postalCode: "", receiverName: "", receiverPhone: "" });
        fetchProfile(); // رفرش اطلاعات پروفایل
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "خطا در ثبت آدرس");
    } finally {
      setAddingAddress(false);
    }
  };


    

  // خروج از حساب
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      toast.success("از حساب خارج شدید");
      router.push("/");
    } catch (err) {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white in-[.dark]:bg-neutral-950 text-neutral-900 in-[.dark]:text-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // اگر کاربر لاگین نکرده باشد
  if (notLoggedIn) {
    return (
      <div className="min-h-screen bg-white in-[.dark]:bg-neutral-950 text-neutral-900 in-[.dark]:text-neutral-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-neutral-50 in-[.dark]:bg-neutral-900 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-3xl">
            <HiOutlineUser />
          </div>
          <h2 className="text-xl font-bold mb-3">حساب کاربری</h2>
          <p className="text-neutral-600 in-[.dark]:text-neutral-400 text-sm mb-8 leading-relaxed">
            برای مشاهده پنل کاربری خود لطفا وارد شوید
          </p>
          <Link
            href={`/auth?callback=${encodeURIComponent('/profile')}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary-hover hover:bg-primary text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
            >
            <HiOutlineLogin className="text-xl" />
            ورود به حساب کاربری
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white in-[.dark]:bg-neutral-950 text-neutral-900 in-[.dark]:text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <Toaster position="top-center" />
      
      <div className="max-w-6xl mx-auto">
        {/* هدر بالای پنل */}
        <div className="bg-neutral-50 in-[.dark]:bg-neutral-900 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-2xl font-bold">
              {userData?.name ? userData.name[0].toUpperCase() : <HiOutlineUser />}
            </div>
            <div>
              <h1 className="text-xl font-bold">{userData?.name || "کاربر گرامی"}</h1>
              <p className="text-sm text-neutral-500 in-[.dark]:text-neutral-400 mt-1" dir="ltr">{userData?.phone}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 in-[.dark]:text-red-400 border border-red-500/20 rounded-xl transition-all text-sm font-medium"
          >
            <HiOutlineLogout className="text-lg" />
            خروج از حساب
          </button>
        </div>

        {/* بدنه اصلی داشبورد */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* سایدبار تب‌ها */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab("info")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === "info" 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-neutral-50 in-[.dark]:bg-neutral-900/50 hover:bg-neutral-100 in-[.dark]:hover:bg-neutral-900 text-neutral-700 in-[.dark]:text-neutral-300 border border-neutral-200 in-[.dark]:border-neutral-800/60"
              }`}
            >
              <HiOutlineUser className="text-xl" />
              اطلاعات حساب
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === "orders" 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-neutral-50 in-[.dark]:bg-neutral-900/50 hover:bg-neutral-100 in-[.dark]:hover:bg-neutral-900 text-neutral-700 in-[.dark]:text-neutral-300 border border-neutral-200 in-[.dark]:border-neutral-800/60"
              }`}
            >
              <HiOutlineShoppingBag className="text-xl" />
              سفارش‌های من ({userData?.orders?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === "addresses" 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-neutral-50 in-[.dark]:bg-neutral-900/50 hover:bg-neutral-100 in-[.dark]:hover:bg-neutral-900 text-neutral-700 in-[.dark]:text-neutral-300 border border-neutral-200 in-[.dark]:border-neutral-800/60"
              }`}
            >
              <HiOutlineLocationMarker className="text-xl" />
              آدرس‌های ثبت‌شده ({userData?.addresses?.length || 0})
            </button>
          </div>

          {/* محتوای داینامیک تب‌ها */}
          <div className="lg:col-span-3 bg-neutral-50 in-[.dark]:bg-neutral-900 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-2xl p-6 shadow-xl">
            
            {/* تب اول: اطلاعات حساب */}
            {activeTab === "info" && (
              <div>
                <h2 className="text-lg font-bold mb-6 pb-4 border-b border-neutral-200 in-[.dark]:border-neutral-800">ویرایش اطلاعات حساب</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm text-neutral-600 in-[.dark]:text-neutral-400 mb-2">نام و نام خانوادگی</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white in-[.dark]:bg-neutral-950 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 in-[.dark]:text-neutral-100 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-600 in-[.dark]:text-neutral-400 mb-2">ایمیل (اختیاری)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@gmail.com"
                      className="w-full bg-white in-[.dark]:bg-neutral-950 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 in-[.dark]:text-neutral-100 focus:outline-none focus:border-primary transition-all"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-600 in-[.dark]:text-neutral-400 mb-2">کد ملی</label>
                    <input
                      type="text"
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                      placeholder="۰۰۱۰۲۳۴۵۶۷"
                      className="w-full bg-white in-[.dark]:bg-neutral-950 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 in-[.dark]:text-neutral-100 focus:outline-none focus:border-primary transition-all"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-600 in-[.dark]:text-neutral-400 mb-2">شماره موبایل (غیرقابل تغییر)</label>
                    <input
                      type="text"
                      disabled
                      value={userData?.phone || ""}
                      className="w-full bg-neutral-100 in-[.dark]:bg-neutral-950/50 border border-neutral-200 in-[.dark]:border-neutral-800/50 rounded-xl px-4 py-3 text-neutral-400 in-[.dark]:text-neutral-500 cursor-not-allowed"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-primary-hover hover:bg-primary text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 mt-4"
                  >
                    {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                  </button>
                </form>
              </div>
            )}

            {/* تب دوم: سفارش‌ها */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-lg font-bold mb-6 pb-4 border-b border-neutral-200 in-[.dark]:border-neutral-800">تاریخچه سفارش‌ها</h2>
                {userData?.orders?.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400 in-[.dark]:text-neutral-500">
                    <HiOutlineShoppingBag className="text-5xl mx-auto mb-3 opacity-40" />
                    <p>هنوز سفارشی ثبت نکرده‌اید.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userData?.orders?.map((order) => (
                      <div key={order.id} className="bg-white in-[.dark]:bg-neutral-950 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-xl p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100 in-[.dark]:border-neutral-800/80 text-sm">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-primary">سفارش #{order.id}</span>
                            <span className="text-neutral-300 in-[.dark]:text-neutral-600">|</span>
                            <span className="text-neutral-500 in-[.dark]:text-neutral-400">
                              {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {order.status === "DELIVERED" ? (
                              <span className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1 rounded-full text-xs">
                                <HiOutlineCheckCircle /> تحویل داده شده
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-amber-600 in-[.dark]:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full text-xs">
                                <HiOutlineClock /> در حال پردازش
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="text-sm text-neutral-700 in-[.dark]:text-neutral-300">
                            <p><span className="text-neutral-400 in-[.dark]:text-neutral-500">آدرس تحویل:</span> {order.addressText}</p>
                          </div>
                          <div className="text-left font-bold text-primary">
                            {Number(order.totalPrice).toLocaleString()} تومان
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* تب سوم: آدرس‌ها */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 in-[.dark]:border-neutral-800">
                  <h2 className="text-lg font-bold">آدرس‌های ثبت‌شده</h2>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-md shadow-primary/20"
                  >
                    + افزودن آدرس جدید
                  </button>
                </div>

                {/* فرم مودال افزودن آدرس */}
                {showAddressModal && (
                  <div className="mb-8 p-5 bg-white in-[.dark]:bg-neutral-950 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-xl space-y-4 shadow-lg">
                    <h3 className="font-bold text-sm text-primary">افزودن آدرس جدید</h3>
                    <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">عنوان آدرس (مثلا منزل، محل کار)</label>
                        <input
                          type="text"
                          value={addressForm.title}
                          onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                          className="w-full bg-neutral-50 in-[.dark]:bg-neutral-900  border border-neutral-200 in-[.dark]:border-neutral-800 focus:outline-none focus:border-primary rounded-lg px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">شهر</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder="مثلا تهران"
                          className="w-full bg-neutral-50 in-[.dark]:bg-neutral-900 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-lg focus:outline-none focus:border-primary px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-neutral-500 mb-1">آدرس دقیق (خیابان، پلاک، واحد)</label>
                        <textarea
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          placeholder="مثلا خیابان ولیعصر، کوچه فلان، پلاک ۱۰"
                          className="w-full bg-neutral-50 in-[.dark]:bg-neutral-900 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-lg focus:outline-none focus:border-primary px-3 py-2 text-sm"
                          rows="2"
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">کد پستی (اختیاری)</label>
                        <input
                          type="text"
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          placeholder="10 رقمی"
                          className="w-full bg-neutral-50 in-[.dark]:bg-neutral-900 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-lg focus:outline-none focus:border-primary px-3 py-2 text-sm"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">نام گیرنده (اختیاری)</label>
                        <input
                          type="text"
                          value={addressForm.receiverName}
                          onChange={(e) => setAddressForm({ ...addressForm, receiverName: e.target.value })}
                          className="w-full bg-neutral-50 in-[.dark]:bg-neutral-900 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-lg focus:outline-none focus:border-primary px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm rounded-lg"
                        >
                          انصراف
                        </button>
                        <button
                          type="submit"
                          disabled={addingAddress}
                          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50"
                        >
                          {addingAddress ? "در حال ثبت..." : "ذخیره آدرس"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* لیست آدرس‌ها */}
                {userData?.addresses?.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400 in-[.dark]:text-neutral-500">
                    <HiOutlineLocationMarker className="text-5xl mx-auto mb-3 opacity-40" />
                    <p>آدرسی ثبت نکرده‌اید.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData?.addresses?.map((addr) => (
                      <div key={addr.id} className="bg-white in-[.dark]:bg-neutral-950 border border-neutral-200 in-[.dark]:border-neutral-800 rounded-xl p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary text-sm">{addr.title}</span>
                          <span className="text-xs text-neutral-400 in-[.dark]:text-neutral-500">{addr.city}</span>
                        </div>
                        <p className="text-sm text-neutral-700 in-[.dark]:text-neutral-300">{addr.street}</p>
                        {addr.postalCode && <p className="text-xs text-neutral-400 in-[.dark]:text-neutral-500">کد پستی: {addr.postalCode}</p>}
                        {addr.receiverName && <p className="text-xs text-neutral-400 in-[.dark]:text-neutral-500">گیرنده: {addr.receiverName}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
