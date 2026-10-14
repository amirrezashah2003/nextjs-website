"use client";
import Image from "next/image"
import { FaBasketShopping , FaMagnifyingGlass } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import Styles from "./HeaderUp.module.css"

function HeaderUp(){
  const [isOpen , setIsOpen] = useState(false)
  const inputRef = useRef(null)
  const magnifyRef = useRef(null)

  useEffect(() => {
    const outsideInputHandler = (e) => {
        const insideInput = inputRef.current.contains(e.target)
        const magnify = magnifyRef.current.contains(e.target)
        if(!insideInput && !magnify){
            setIsOpen(false)
        }
    }
    document.addEventListener("click" , outsideInputHandler)
    return () => {
        document.removeEventListener("click", outsideInputHandler);
    };
  }, [inputRef, magnifyRef])
  

  const searchHandler = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header className="bg-bg-tertiary h-20 select-none text-xs sm:text-sm md:text-base">
      <div className="container h-10/10">

        <div className="row h-10/10 grid grid-cols-[4fr_11fr] lg:grid-cols-[4fr_6fr]">


          <div className="flex">
            <div className="flex items-center">
                <a href="/">
                    <Image 
                        src= "/logo/amir-logo.png"
                        alt="amir logo"
                        width={80}
                        height={80}
                    />
                </a>
            </div>
            {/* اینپوت سرچ دکستاپ */}
            <div className="input items-center hidden lg:flex flex-1" >
              <input className={`${Styles.input}`} type="text" placeholder="جستجوی محصولات ..." />
            </div>
          </div>



          <div className="flex gap-1 md:gap-4 justify-end items-center relative">

            <ThemeToggle />
            <FaMagnifyingGlass ref={magnifyRef} onClick={searchHandler} className="lg:hidden w-5 h-5 me-3" />

            {/* اینپوت سرچ موبایل */}
            <div ref={inputRef} className={`${Styles.searchcontainer} ${isOpen ? Styles.active : ""}   lg:hidden`} > 
              <input className={`${Styles.search}`} type="text" placeholder="جستجوی محصولات ..." />
            </div>



            <a href="" className="border border-primary rounded-[5px] px-2 py-1">ورود</a>
            <a href="" className="border border-primary rounded-[5px] px-2 py-1">ثبت نام</a>

            <a href="" className="flex items-center border border-primary rounded-[5px] px-2 py-1 relative">
              <span>سبد خرید</span>
              <FaBasketShopping className=" h-4 w-4 md:h-6 md:w-6" />
            
              <span className={Styles.shopnumber}>0</span>
            </a>
          </div>
        </div>
      </div>



    </header>
  )
}

export default HeaderUp