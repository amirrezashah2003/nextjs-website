"use client";

import { usePathname } from "next/navigation";

export default function MainLayoutClient({ children, header, footer }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";

  return (
    <>
      {!isAuthPage && header}
      <main>{children}</main>
      {!isAuthPage && footer}
    </>
  );
}
