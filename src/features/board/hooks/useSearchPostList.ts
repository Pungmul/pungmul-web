"use client";
import { useCallback, useMemo } from "react";
import { debounce } from "lodash";

import { useSearchPostListInfiniteQuery } from "@/features/board/queries";

interface UseSearchPostListProps {
  boardId: number;
  keyword: string;
  size: number;
}

export function useSearchPostList({ boardId,  keyword, size }: UseSearchPostListProps) {
  const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage, error } =
    useSearchPostListInfiniteQuery(boardId, keyword, size);
  // 디바운스된 실제 API 호출 함수
  const debouncedFetchNextPage = useMemo(
    () =>
      debounce(
        async () => {
          if (!isFetchingNextPage && hasNextPage) {
            console.log("Loading next page...");
            await fetchNextPage();
          }
        },
        300,
        { leading: true, trailing: false }
      ),
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // 즉시 로딩 표시 + 디바운스된 API 호출
  const handleLoadMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      debouncedFetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, debouncedFetchNextPage]);

  if (error) {
    console.error("Error loading posts:", error);
  }

  return {
    posts: data?.pages.flatMap((page) => page.list) || [],
    isLoading: isLoading,
    isFetching: isFetchingNextPage,
    hasNextPage,
    onLoadMore: handleLoadMore,
    error,
  };
}
