import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 클라이언트에서 즉시 refetch하지 않도록 설정
        staleTime: 1000 * 60, // 1분
        gcTime: 1000 * 60 * 5, // 5분 (이전 cacheTime)
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error: unknown) => {
          // 4xx 에러는 재시도하지 않음
          if (error instanceof Error && error.message.includes("400")) {
            return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버: 항상 새로운 query client 생성
    return makeQueryClient();
  } else {
    // 브라우저: 싱글톤 query client 생성
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
} 