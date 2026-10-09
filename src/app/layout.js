import Header from "@/components/layout/Header/Header";
import HeaderDown from "@/components/layout/Header/HeaderDown";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import QueryProvider from "./QueryProvider";
import "./globals.css";


export const metadata = {
  title: "Amir Website",
  description: "An online store for smartphones, laptops, tablets, and other electronic devices.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fa-IR"
      dir="rtl"
      className={`h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <Header />  
            <HeaderDown />        
            {children}
          </NextThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
