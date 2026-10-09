"use client"
import { useState } from "react";
import { QueryClient , QueryClientProvider } from "@tanstack/react-query"

export default function QueryProvider({children}){
    const [queryClient] = useState(
      () =>
        new QueryClient({
            defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // مثلاً داده‌ها تا ۱ دقیقه تازه هستند
            },
            },
        })
    );
    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}