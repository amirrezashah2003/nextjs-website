import axios from "axios";

// تعیین آدرس پایه برای سرور و کلاینت
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // اگر در کلاینت (مرورگر) هستیم، آدرس نسبی کافی است
    return "/api";
  }
  // اگر در سرور هستیم، باید آدرس کامل (شامل پروتکل و پورت) باشد
  const protocol = "http";
  const host = process.env.VERCEL_URL || "localhost:3000";
  return `${protocol}://${host}/api`;
};

const http = axios.create({
  baseURL: getBaseURL(),
});

export default http;