"use client";

import { useEffect } from "react";

export default function MegaMenu({ isOpen, onClose, children }) {
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
        className={`absolute h-screen top-full inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 2. Drawer (بدنه منو) */}
      <div
        className={`absolute h-screen top-full right-0 z-60 max-w-md w-full lg:w-70 bg-bg-secondary shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      > 
        <div>{children}</div>
      </div>
    </>
  );
}
