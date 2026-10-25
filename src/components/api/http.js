import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // در کلاینت (مرورگر): از مسیر نسبی استفاده می‌کنیم تا با هر دامنه ای کار کند
    return "/api";
  }

  // در سرور (SSR): نیاز به آدرس کامل داریم
  // اگر SERVER_URL در .env تعریف شده باشد از آن استفاده می‌کند، در غیر این صورت localhost
  const baseUrl = process.env.SERVER_URL || "http://localhost:3000";
  
  // مدیریت نکردن اسلش‌های اضافه یا کم
  const cleanBaseUrl = baseUrl.replace(/\/$/, ""); 
  return `${cleanBaseUrl}/api`;
};

const http = axios.create({
  baseURL: getBaseURL(),
});

export default http;
