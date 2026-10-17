"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { 
  FiBox, FiUsers, FiPlus, FiEdit2, FiTrash2, 
  FiCheck, FiX, FiAlertCircle, FiShield 
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'users'
  
  // States for Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    category: "", brand: "", model: "", name: "", price: "", info: "", img: ""
  });

  // States for User Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: "", phone: "" });

  const queryClient = useQueryClient();

  // --- FETCH PRODUCTS ---
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/products");
      return res.data.products;
    }
  });

  // --- FETCH USERS ---
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/users");
      return res.data.users;
    }
  });

  // --- PRODUCT MUTATIONS ---
  const saveProductMutation = useMutation({
    mutationFn: async (formData) => {
      if (editingProduct) {
        return axios.put("/api/admin/products", { ...formData, id: editingProduct.id });
      } else {
        return axios.post("/api/admin/products", formData);
      }
    },
    onSuccess: (res) => {
      toast.success(res.data.message || "عملیات موفقیت‌آمیز بود");
      queryClient.invalidateQueries(["admin-products"]);
      closeProductModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "خطایی رخ داد");
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id) => axios.delete(`/api/admin/products?id=${id}`),
    onSuccess: () => {
      toast.success("محصول با موفقیت حذف شد.");
      queryClient.invalidateQueries(["admin-products"]);
    },
    onError: (err) => toast.error(err.response?.data?.error || "خطا در حذف محصول")
  });

  // --- USER MUTATIONS ---
  const updateUserMutation = useMutation({
    mutationFn: async (formData) => {
      return axios.put("/api/admin/users", { ...formData, id: editingUser.id });
    },
    onSuccess: (res) => {
      toast.success(res.data.message || "کاربر بروزرسانی شد");
      queryClient.invalidateQueries(["admin-users"]);
      closeUserModal();
    },
    onError: (err) => toast.error(err.response?.data?.error || "خطا در بروزرسانی کاربر")
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => axios.delete(`/api/admin/users?id=${id}`),
    onSuccess: () => {
      toast.success("کاربر با موفقیت حذف شد.");
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: (err) => toast.error(err.response?.data?.error || "خطا در حذف کاربر")
  });

  // Handlers
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({ category: "", brand: "", model: "", name: "", price: "", info: "", img: "" });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      category: product.category || "",
      brand: product.brand || "",
      model: product.model || "",
      name: product.name || "",
      price: product.price || "",
      info: product.info || "",
      img: product.img || ""
    });
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setUserForm({ name: user.name || "", phone: user.phone || "" });
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 in-[.dark]:bg-gray-950 text-gray-800 in-[.dark]:text-gray-100 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white in-[.dark]:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 in-[.dark]:border-gray-800 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
              <FiShield className="text-primary in-[.dark]:text-primary" />
              پنل مدیریت ادمین
            </h1>
            <p className="text-sm text-gray-500 in-[.dark]:text-gray-400 mt-1">
              مدیریت محصولات، سفارشات و کاربران فروشگاه
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 in-[.dark]:bg-gray-800 p-1.5 rounded-xl gap-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === "products"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 in-[.dark]:text-gray-300 hover:text-gray-900 in-[.dark]:hover:text-white"
              }`}
            >
              <FiBox /> محصولات ({productsData?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === "users"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 in-[.dark]:text-gray-300 hover:text-gray-900 in-[.dark]:hover:text-white"
              }`}
            >
              <FiUsers /> کاربران ({usersData?.length || 0})
            </button>
          </div>
        </div>

        {/* --- PRODUCTS TAB CONTENT --- */}
        {activeTab === "products" && (
          <div className="bg-white in-[.dark]:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 in-[.dark]:border-gray-800 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">لیست محصولات</h2>
              <button
                onClick={handleOpenCreateProduct}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-sm"
              >
                <FiPlus size={18} /> افزودن محصول جدید
              </button>
            </div>

            {productsLoading ? (
              <div className="text-center py-12 text-gray-400">در حال بارگذاری محصولات...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 in-[.dark]:border-gray-800 text-gray-400 in-[.dark]:text-gray-500 text-sm">
                      <th className="py-3 px-4">تصویر</th>
                      <th className="py-3 px-4">نام محصول</th>
                      <th className="py-3 px-4">دسته‌بندی</th>
                      <th className="py-3 px-4">برند</th>
                      <th className="py-3 px-4">قیمت (تومان)</th>
                      <th className="py-3 px-4 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 in-[.dark]:divide-gray-800 text-sm">
                    {productsData?.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 in-[.dark]:hover:bg-gray-800/50 transition">
                        <td className="py-3 px-4">
                          <img src={product.img || "/placeholder.png"} alt={product.name} className="w-12 h-12 object-cover rounded-lg border in-[.dark]:border-gray-700" />
                        </td>
                        <td className="py-3 px-4 font-semibold">{product.name}</td>
                        <td className="py-3 px-4 text-gray-500 in-[.dark]:text-gray-400">{product.category}</td>
                        <td className="py-3 px-4 text-gray-500 in-[.dark]:text-gray-400">{product.brand}</td>
                        <td className="py-3 px-4 font-medium">{Number(product.price).toLocaleString()}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(product)}
                              className="p-2 bg-blue-50 in-[.dark]:bg-blue-950/40 text-blue-600 in-[.dark]:text-blue-400 rounded-lg hover:bg-blue-100 transition"
                              title="ویرایش"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
                                  deleteProductMutation.mutate(product.id);
                                }
                              }}
                              className="p-2 bg-red-50 in-[.dark]:bg-red-950/40 text-red-600 in-[.dark]:text-red-400 rounded-lg hover:bg-red-100 transition"
                              title="حذف"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- USERS TAB CONTENT --- */}
        {activeTab === "users" && (
          <div className="bg-white in-[.dark]:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 in-[.dark]:border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-6">لیست کاربران ثبت‌نام شده</h2>

            {usersLoading ? (
              <div className="text-center py-12 text-gray-400">در حال بارگذاری کاربران...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 in-[.dark]:border-gray-800 text-gray-400 in-[.dark]:text-gray-500 text-sm">
                      <th className="py-3 px-4">شناسه</th>
                      <th className="py-3 px-4">نام کاربر</th>
                      <th className="py-3 px-4">شماره تماس</th>
                      <th className="py-3 px-4">تعداد آدرس‌ها</th>
                      <th className="py-3 px-4">تعداد سفارشات</th>
                      <th className="py-3 px-4 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 in-[.dark]:divide-gray-800 text-sm">
                    {usersData?.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 in-[.dark]:hover:bg-gray-800/50 transition">
                        <td className="py-3 px-4 font-mono">
                          {user.id === 1 ? (
                            <span className="bg-primary in-[.dark]:bg-primary text-white px-2 py-1 rounded text-xs font-bold">
                              ادمین کل (#1)
                            </span>
                          ) : (
                            `#${user.id}`
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold">{user.name || "بدون نام"}</td>
                        <td className="py-3 px-4 font-mono">{user.phone}</td>
                        <td className="py-3 px-4">{user.addresses?.length || 0}</td>
                        <td className="py-3 px-4">{user.orders?.length || 0}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditUser(user)}
                              className="p-2 bg-blue-50 in-[.dark]:bg-blue-950/40 text-blue-600 in-[.dark]:text-blue-400 rounded-lg hover:bg-blue-100 transition"
                              title="ویرایش کاربر"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            {user.id !== 1 && (
                              <button
                                onClick={() => {
                                  if (confirm("آیا از حذف این کاربر اطمینان دارید؟")) {
                                    deleteUserMutation.mutate(user.id);
                                  }
                                }}
                                className="p-2 bg-red-50 in-[.dark]:bg-red-950/40 text-red-600 in-[.dark]:text-red-400 rounded-lg hover:bg-red-100 transition"
                                title="حذف کاربر"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white in-[.dark]:bg-gray-900 rounded-2xl w-full max-w-2xl p-6 shadow-xl border border-gray-100 in-[.dark]:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
              </h3>
              <button onClick={closeProductModal} className="text-gray-400 hover:text-gray-600 in-[.dark]:hover:text-gray-200">
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveProductMutation.mutate(productForm); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">نام محصول</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                    className="w-full bg-gray-50 in-[.dark]:bg-gray-800 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">دسته‌بندی</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    required
                    className="w-full bg-gray-50 in-[.dark]:bg-gray-800 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">برند</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    required
                    className="w-full bg-gray-50 in-[.dark]:bg-gray-800 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">مدل</label>
                  <input
                    type="text"
                    value={productForm.model}
                    onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                    className="w-full bg-gray-50 in-[.dark]:bg-gray-800 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">قیمت (تومان)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    className="w-full bg-gray-50 in-[.dark]:bg-gray-800 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">لینک تصویر</label>
                  <input
                    type="text"
                    value={productForm.img}
                    onChange={(e) => setProductForm({ ...productForm, img: e.target.value })}
                    className="w-full bg-gray-50 in-[.dark]:bg-gray-800 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">توضیحات مشخصات</label>
                <textarea
                  rows="3"
                  value={productForm.info}
                  onChange={(e) => setProductForm({ ...productForm, info: e.target.value })}
                  className="w-full bg-gray-50 in-[.dark]:bg-gray-800 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 in-[.dark]:border-gray-800">
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-100 in-[.dark]:bg-gray-800  hover:text-gray-800 hover:bg-gray-200 transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={saveProductMutation.isPending}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary-hover  text-white transition shadow-sm"
                >
                  {saveProductMutation.isPending ? "در حال ذخیره..." : "ذخیره محصول"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- USER MODAL --- */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white in-[.dark]:bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 in-[.dark]:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">ویرایش اطلاعات کاربر</h3>
              <button onClick={closeUserModal} className="text-gray-400 hover:text-gray-600 in-[.dark]:hover:text-gray-200">
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); updateUserMutation.mutate(userForm); }} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">نام و نام خانوادگی</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full bg-gray-50 in-[.dark]:bg-gray-800 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">شماره تماس</label>
                <input
                  type="text"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  required
                  className="w-full bg-gray-50 in-[.dark]:bg-gray-800 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 in-[.dark]:border-gray-800">
                <button
                  type="button"
                  onClick={closeUserModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-100 in-[.dark]:bg-gray-800 hover:bg-gray-200 hover:text-gray-800 transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary-hover text-white transition shadow-sm"
                >
                  {updateUserMutation.isPending ? "در حال بروزرسانی..." : "بروزرسانی کاربر"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
