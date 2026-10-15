import MainLayout from "@/components/MainLayout";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import QueryProvider from "./QueryProvider";
import "./globals.css";


export const metadata = {
  title: "Amir Website",
  description: "An online store for smartphones, laptops, tablets, and other electronic devices.",
  icons: {
    icon: "/logo/amir-logo.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fa-IR"
      dir="rtl"
      className={`h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col justify-between">
        <QueryProvider>
          <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <MainLayout>
             {children}
            </MainLayout>     
          </NextThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
