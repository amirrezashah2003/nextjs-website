"use client";

import { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

export default function Offcanvas({ isOpen, onClose, children }) {
  // بستن منو با دکمه Esc
  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [onClose]);

  return (
    <>
      {/* 1. Overlay (پس‌زمینه تیره) */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 2. Drawer (بدنه منو) */}
      <div
        className={`fixed top-0 right-0 z-50 h-full max-w-md w-full lg:w-70 bg-bg-secondary shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">محصولات</h2>
          <button onClick={onClose} className="p-2">
            <IoCloseOutline className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}
