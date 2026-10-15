// lib/get-query-client.ts
import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // با این تنظیم، داده‌ها برای ۶۰ ثانیه تازه می‌مانند
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // این تنظیم برای هیدریشن (Hydration) بسیار حیاتی است
        // باعث می‌شود داده‌هایی که در حالت pending هستند هم به کلاینت منتقل شوند
        serializeData: (data) => JSON.stringify(data),
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient = undefined;

export function getQueryClient() {
  if (isServer) {
    // در سمت سرور: همیشه باید یک نمونه جدید بسازیم تا داده‌ها بین کاربران نشت نکند
    return makeQueryClient();
  } else {
    // در سمت کلاینت: همیشه از یک نمونه ثابت استفاده می‌کنیم
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
