import Link from 'next/link';
// ایمپورت آیکون‌ها از react-icons/fa (FontAwesome)
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Image from 'next/image';


function Footer(){
  return (
    <footer className="border-t border-gray-200 in-[.dark]:border-gray-800 bg-bg-secondary transition-colors">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* ستون اول: درباره ما */}
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                    <Image 
                        src= "/logo/amir-logo.png"
                        alt="amir logo"
                        fill
                        className="object-contain"
                    />
                </div> 
                <h2 className="text-xl font-bold text-gray-900 in-[.dark]:text-white">فروشگاه امیررضا</h2>
             </div>
            <p className="text-gray-600 in-[.dark]:text-gray-400 text-sm leading-6">
              تخصص ما در ارائه به‌روزترین لپ‌تاپ‌ها و گوشی‌های هوشمند با ضمانت اصالت کالا و بهترین قیمت در بازار است.
            </p>
          </div>

          {/* ستون دوم: دسترسی سریع */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 in-[.dark]:text-white">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm text-gray-600 in-[.dark]:text-gray-400">
              <li><Link href="/about" className="hover:text-primary-hover! transition-colors">درباره ما</Link></li>
              <li><Link href="/contact" className="hover:text-primary-hover! transition-colors">تماس با ما</Link></li>
            </ul>
          </div>

          {/* ستون سوم: اطلاعات تماس */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 in-[.dark]:text-white">تماس با ما</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {/* استفاده از آیکون‌های react-icons */}
              <li className="flex items-center gap-2"><FaPhone className="w-4 h-4" /> 09014148983</li>
              <li className="flex items-center gap-2"><FaEnvelope className="w-4 h-4" /> amir1382reza1382reza@gmail.com</li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="w-4 h-4" /> کرمانشاه، اسلام‌آبادغرب</li>
            </ul>
          </div>

          {/* ستون چهارم: نمادها */}
          <div className="flex gap-4">
             <div className="relative overflow-hidden w-24 h-24 bg-white in-[.dark]:bg-gray-900 border border-gray-200 in-[.dark]:border-gray-800 rounded-xl flex items-center justify-center text-xs text-gray-400">
                <Image 
                        src= "https://afraa.shop/wp-content/uploads/2025/11/enamad-2.png"
                        alt="enamad"
                        fill
                        className="object-cover"
                    />
             </div>
             <div className="relative overflow-hidden w-24 h-24 bg-white in-[.dark]:bg-gray-900 border border-gray-200 in-[.dark]:border-gray-800 rounded-xl flex items-center justify-center text-xs text-gray-400">
                <Image 
                        src= "https://afraa.shop/wp-content/uploads/2025/11/sabt.png"
                        alt="sabt"
                        fill
                        className="object-cover"
                    />
             </div>
          </div>
        </div>

        {/* خط کپی رایت */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© تمامی حقوق برای فروشگاه محفوظ است.</p>
          <div className="flex gap-4 text-lg">
             <FaInstagram className="cursor-pointer hover:text-primary-hover transition-colors" />
             <FaLinkedin className="cursor-pointer hover:text-primary-hover transition-colors" />
             <FaTwitter className="cursor-pointer hover:text-primary-hover transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
