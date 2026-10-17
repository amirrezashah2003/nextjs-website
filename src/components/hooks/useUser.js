"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await axios.get("/api/auth/me");
      return res.data.user; // آبجکت کاربر یا null برمی‌گرداند
    },
    staleTime: 1000 * 60 * 5, // ۵ دقیقه کش بماند
  });

  return {
    user: data,
    userId: data?.id,
    isLoading,
  };
};
