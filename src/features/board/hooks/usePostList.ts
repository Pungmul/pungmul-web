"use client";
import { useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";

import { usePostListInfiniteQuery } from "@/features/board/queries";
import { useFrequentBoard } from "@/features/board/store";
import { BoardData } from "@pThunder/features/board";

interface UsePostListProps {
  boardId: number;
  boardData: BoardData|undefined;
}

export function usePostList({ boardId, boardData }: UsePostListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    usePostListInfiniteQuery(boardId);

  const { visitBoard } = useFrequentBoard();

  useEffect(() => {
    if (!boardData) return;
    visitBoard({ id: boardId, name: boardData?.boardInfo.rootCategoryName });
  }, [boardId, boardData?.boardInfo.rootCategoryName, visitBoard]);

  // 모든 페이지의 포스트를 하나의 배열로 합치기
  const allPosts = useMemo(() => {
    if (!boardData) return [];
    if (!data) return boardData?.recentPostList.list;

    // 첫 번째 페이지는 서버에서 받은 초기 데이터와 중복될 수 있으므로 제외하고 시작
    return data.pages.flatMap((page) => page.list);
  }, [data, boardData?.recentPostList.list]);

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
    posts: allPosts,
    isLoading: isFetchingNextPage,
    hasNextPage,
    onLoadMore: handleLoadMore,
    error,
  };
}
