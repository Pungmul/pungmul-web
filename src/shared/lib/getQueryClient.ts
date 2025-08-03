import { isServer, QueryClient } from "@tanstack/react-query";

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  });
};
//브라우저 쿼리 클라이언트 캐시
let browserQueryClient: QueryClient | null = null;

export const getQueryClient = () => {
  if (isServer) {
    //서버라면 매번 새로운 쿼리 클라이언트를 생성
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      //브라우저라면 쿼리 클라이언트를 생성하고 캐시에 저장
      browserQueryClient = makeQueryClient();
    }
    //브라우저라면 이미 생성된 쿼리 클라이언트를 반환
    return browserQueryClient;
  }
}; 