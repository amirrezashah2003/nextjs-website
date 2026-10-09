"use client"

import { useTheme } from "next-themes"
import { IoSunny, IoMoon } from "react-icons/io5";
import { useState , useEffect } from "react";

export default function ThemeToggle(){
    const { theme , setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // وقتی کامپوننت در کلاینت لود شد، آن را به true تغییر می‌دهیم
    useEffect(() => {
        setMounted(true)
    }, [])

    // تا وقتی که مطمئن نشدیم لود شده، چیزی رندر نکن (یا یک لودینگ ساده)
    if (!mounted) return <div className="w-6 h-6" />;


    return(
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <IoSunny className="w-6 h-6"/> : <IoMoon className="w-6 h-6"/>  }
        </button>
    )
}