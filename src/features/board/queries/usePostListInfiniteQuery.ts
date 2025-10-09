import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { postQueryKeys } from "@pThunder/features/post";
import { loadPostList } from "../api";

export const usePostListInfiniteQuery = (
  boardId: number,
  size: number = 10
) => {
  return useInfiniteQuery({
    queryKey: postQueryKeys.list(boardId),
    queryFn: ({ pageParam = 0 }) => loadPostList(boardId, pageParam, size),
    getNextPageParam: (lastPage) => {
      // hasNextPage가 true이면 다음 페이지 번호 반환, 아니면 undefined
      return lastPage.hasNextPage ? lastPage.pageNum + 1 : undefined;
    },
    initialPageParam: 0,
    retry: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5분간 신선한 데이터로 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    placeholderData: keepPreviousData, // 이전 데이터 유지로 부드러운 전환
  });
};
