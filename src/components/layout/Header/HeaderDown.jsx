"use client"

import { AiOutlineMenuUnfold } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { MdLaptopChromebook } from "react-icons/md";
import { CiMobile1 } from "react-icons/ci";
import { TbDeviceIpadHorizontal } from "react-icons/tb";
import { GiConsoleController } from "react-icons/gi";
import { FaArrowRightLong } from "react-icons/fa6";

import Offcanvas from "./Offcanvas.jsx";
import MegaMenu from "./MegaMenu.jsx";
import { useState } from "react";

import { useRouter } from 'next/navigation';









const menuData = {
  main: [
    { name:"laptop", label: "لپتاپ", icon: <MdLaptopChromebook className="me-1" /> },
    { name:"mobile", label: "موبایل", icon: <CiMobile1 className="me-1" /> },
    { name:"tablet", label: "تبلت", icon: <TbDeviceIpadHorizontal className="me-1" /> },
    { name:"console", label: "کنسول", icon: <GiConsoleController className="me-1" /> },
  ],

  "لپتاپ": [
    { label: "ایسوس" , name: "asus" }, 
    { label: "لنوو" , name: "lenovo" }, 
    { label: "مک" , name: "apple" }, 
    { label: "اچ پی" , name: "hp" }, 
    { label: "ام اس آی"  , name: "msi"}
  ],
  "ایسوس": [{ label: "asus ROG" , name: "rog" }, { label: "asus TUF", name: "tuf" }, { label: "asus zenbook", name: "zenbook"}],
  "لنوو": [{ label: "Legion" , name: "legion" }, { label: "LOQ" , name: "loq" }, { label: "ideapad" , name: "ideapad" }],
  "مک": [{ label: "air" , name: "macbookair" }, { label: "pro" , name: "macbookpro"}],



  "موبایل": [
    { label: "آیفون" , name: "apple" }, 
    { label: "سامسونگ", name: "samsung" }, 
    { label: "شیائومی", name: "xiaomi" }
  ],
  "آیفون": [{ label: "iphone 17" , name: "iphone17" }, { label: "iphone 16", name: "iphone16"}],
  "سامسونگ": [{ label: "a 56", name: "a56" }, { label: "a 36" , name: "a36" }],
  "شیائومی": [{ label: "poco x7" , name: "poco" }, { label: "redmi note 14" , name: "redmi" }],


  "تبلت": [{ label: "آیپد" , name: "apple" }, { label: "تبلت سامسونگ" , name: "samsung" }],
  "کنسول": [{ label: "PS5" , name: "sony" }, { label: "Xbox" ,name: "microsoft" }]
};
console.log(menuData["main"][0].name)









export default function HeaderDown(){
    const router = useRouter();
    // موبایل
    // این استیت برای باز و بسته شدن آفکنوسه
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // برای هندل کردن منو آفکنوس موبایل همراه با زیرمنوها میایم و یک هیستوری از آرایه برای لایه ها تعریف میکنیم
    const [history, setHistory] = useState(["main"]);
    // آخرین آیتم آرایه همیشه منوی فعلی است
    const currentMenuLevel = history[history.length - 1];

    // تابع برای رفتن به مرحله بعد
    const goForward = (nextLevel) => {
        setHistory([...history, nextLevel]);
    };
    // تابع برای بازگشت به مرحله قبل (فقط حذف آخرین آیتم)
    const goBack = () => {
        if (history.length > 1) {
            setHistory(history.slice(0, -1));
        }
    };


   




    // پیدا کردن روت درست در منو آفکنوس موبایل
    const activeCategory = menuData["main"].find(item => item.label === history[1]);
    let activeBrand = null
    if(activeCategory) { activeBrand = menuData[history[1]].find(item => item.label === history[2])}
    let activeModel = null
    if(activeCategory && activeBrand) { activeModel = menuData[history[2]].find(item => item.label === history[3])}





    // دکستاپ
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

    return(
        <header className="bg-bg-secondary py-7 lg:relative">
            <div className="container">
                <div className="row grid grid-cols-[1fr_3fr] lg:grid-cols-[8fr_2fr]">
    
                    <div>
                        {/* دکمه منو موبایل */}
                        <button className="lg:hidden cursor-pointer" onClick={() => {setIsMenuOpen(true); setHistory(["main"])}}>
                            <AiOutlineMenuUnfold className="w-8 h-8" />
                        </button>

                        {/* منو آفکنوس موبایل */}
                        <Offcanvas isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                            {/* درست کردن دکمه بازگشت */}
                            {history.length > 1 && (
                                <div className="p-4 flex items-center cursor-pointer" onClick={goBack}>
                                    <FaArrowRightLong /> <span className="mr-2">بازگشت</span>
                                </div>
                            )}

                            {history.length === 2 && activeCategory  && (
                                <a 
                                    href={`/products/${activeCategory.name}`} 
                                    className="mb-5 cursor-pointer inline-block border border-primary rounded-[7px] px-2 py-0.5"
                                >
                                    نمایش تمامی محصولات
                                </a>
                            )}
                            {history.length === 3 && activeBrand  && (
                                <a 
                                    href={`/products/${activeCategory.name}/${activeBrand.name}`} 
                                    className="mb-5 cursor-pointer inline-block border border-primary rounded-[7px] px-2 py-0.5"
                                >
                                    نمایش تمامی محصولات
                                </a>
                            )}

                                <ul>
                                    {/* لیست کردن آیتم‌های مرحله فعلی بر اساس key */}
                                    {menuData[currentMenuLevel].map((item, index) => {
                                        // چک می‌کنیم آیا این آیتم خودش زیرمنو دارد؟
                                        const hasSubMenu = menuData.hasOwnProperty(item.label); 
                                        // (نکته: در اینجا باید کمی دقت کنید که نام آیتم‌ها با کلیدهای آبجکت شما همخوانی داشته باشد)

                                        return (
                                            <li 
                                                key={index} 
                                                className="cursor-pointer flex justify-between items-center border-b border-dotted last:border-0 py-3"
                                                onClick={() => {
                                                    // اگر زیرمنو دارد، برو به اون سطح، وگرنه کار خاصی نکن (یا لینک بده)
                                                    if (hasSubMenu) {
                                                        goForward(item.label);
                                                    }
                                                    else{
                                                        if(history.length === 2){
                                                            const finalUrl = `/products/${activeCategory.name}/${item.name}`; 
                                                            router.push(finalUrl);
                                                            setIsMenuOpen(false);
                                                        }
                                                        if(history.length === 3){
                                                            const finalUrl = `/products/${activeCategory.name}/${activeBrand.name}/${item.name}`; 
                                                            router.push(finalUrl);
                                                            setIsMenuOpen(false);
                                                        }
                                                    }
                                                }}
                                            >
                                                <span className="inline-flex items-center">
                                                    {/* اگر آیکونی برای این آیتم تعریف شده بود، نمایشش بده */}
                                                    {item.icon && item.icon}
                                                    <span>{item.label}</span>
                                                </span>
                                                {/* اگر زیرمنو دارد فلش نشان بده */}
                                                {hasSubMenu && <IoIosArrowBack />}
                                            </li>
                                        );
                                    })}
                                </ul>

                        </Offcanvas>
























                        {/* منو دکستاپ */}
                        <div className="hidden lg:inline-flex">
                            <button onClick={() => setIsDesktopMenuOpen(true)} type="button" className="flex items-center border-b-3 border-primary rounded-[7px] py-1 px-2 hover:border-primary-hover  hover:text-text-hover">
                                <AiOutlineMenuUnfold />
                                <span>محصولات</span>
                            </button>

                            <MegaMenu isOpen={isDesktopMenuOpen} onClose={() => setIsDesktopMenuOpen(false)}>
                                <ul className="w-full mt-2">
                                    {menuData["main"].map( (item , index) => (
                                        <li key={index} className="flex justify-between items-center px-4 group/main">
                                            <div className={`cursor-pointer flex items-center justify-between w-full px-1 py-3 border-b border-dotted rounded-[7px] group-hover/main:bg-primary group-hover/main:text-white transition-colors duration-200`}>
                                                <a href={`/products/${item.name}`} className="flex items-center justify-between w-full">
                                                    <span className="flex items-center">
                                                        {item.icon && item.icon}
                                                        {item.label}
                                                    </span>
                                                    {menuData.hasOwnProperty(item.label) && <IoIosArrowBack /> }
                                                </a>
                                            </div>

                                            {menuData.hasOwnProperty(item.label)  && (
                                                <div className="translate-x-3 opacity-0 pointer-events-none  group-hover/main:translate-x-0  group-hover/main:opacity-100 group-hover/main:pointer-events-auto absolute h-screen right-full top-0 w-64 bg-bg-secondary z-50 shadow-[inset_-15px_0_15px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out">
                                                    <ul className="w-full mt-2">
                                                        {menuData[item.label].map((item2 , index2) => (
                                                            <li key={index2} className="flex justify-between items-center px-4 group/sub">
                                                                <div className={`cursor-pointer flex items-center justify-between w-full px-1 py-3 border-b border-dotted rounded-[7px] group-hover/sub:bg-primary group-hover/sub:text-white transition-colors duration-200`}>
                                                                    <a href={`/products/${item.name}/${item2.name}`} className="flex justify-between items-center w-full">
                                                                        <span className="flex items-center">
                                                                            {item2.icon && item2.icon}
                                                                            {item2.label}
                                                                        </span>
                                                                        {menuData.hasOwnProperty(item2.label) && <IoIosArrowBack /> }
                                                                    </a>
                                                                </div>

                                                                {menuData.hasOwnProperty(item2.label) && (
                                                                    <div className="translate-x-3 opacity-0 pointer-events-none  group-hover/sub:translate-x-0  group-hover/sub:opacity-100 group-hover/sub:pointer-events-auto absolute h-screen right-full top-0 w-64 bg-bg-secondary z-50 shadow-[inset_-15px_0_15px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out">
                                                                        <ul className="w-full mt-2">
                                                                            {menuData[item2.label].map((item3, index3) => (
                                                                            <li key={index3} className="px-4 list-none">
                                                                                <div className={`cursor-pointer flex items-center justify-between w-full px-1 py-3 border-b border-dotted rounded-[7px] hover:bg-primary hover:text-white transition-colors duration-200`}>
                                                                                    <a href={`/products/${item.name}/${item2.name}/${item3.name}`} className="flex items-center justify-between w-full">
                                                                                        <span className="flex items-center">
                                                                                            {item3.icon && item3.icon}
                                                                                            {item3.label}
                                                                                        </span>
                                                                                        {menuData.hasOwnProperty(item3.label) && <IoIosArrowBack /> }
                                                                                    </a>
                                                                                </div>
                                                                            </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        </li>
                                    ))}
                                </ul>
                            </MegaMenu>
                        </div>
                        
                    </div>






                    <nav>
                        <ul className="flex gap-3 items-center justify-end">
                            <li>
                                <a href="" className="flex items-center border-b-3 border-primary rounded-[7px] py-1 px-2 hover:border-primary-hover hover:text-text-hover"> پنل کاربری</a>
                            </li>
                            <li>
                                <a href="" className="flex items-center border-b-3 border-primary rounded-[7px] py-1 px-2 hover:border-primary-hover hover:text-text-hover"> درباره من </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}