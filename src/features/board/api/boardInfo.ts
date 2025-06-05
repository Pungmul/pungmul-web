import { BoardData, PostListResponse } from "@/shared/types/board/type";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// API 함수들
export const loadMorePostsAPI = async (
  id: number,
  page: number = 0,
  size: number = 10
): Promise<PostListResponse> => {
  const response = await fetch(`/board/${id}/api?page=${page}&size=${size}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("게시글 목록 로드 실패");

  const { recentPostList } = (await response.json()) as BoardData;
  
  return recentPostList;
};

const fetchBoardInfoAPI = async (boardId: number): Promise<BoardData> => {
  const response = await fetch(`/board/${boardId}/info`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("게시판 정보 로드 실패: " + response.status);

  return response.json();
};

// React Query Hooks
export const usePostListInfiniteQuery = (
  boardId: number,
  size: number = 10
) => {
  return useInfiniteQuery({
    queryKey: ["postList", boardId],
    queryFn: ({ pageParam = 0 }) => loadMorePostsAPI(boardId, pageParam, size),
    getNextPageParam: (lastPage) => {
      // hasNextPage가 true이면 다음 페이지 번호 반환, 아니면 undefined
      return lastPage.hasNextPage ? lastPage.pageNum + 1 : undefined;
    },
    initialPageParam: 0,
  });
};

export const useLoadBoardInfo = (boardId: number) => {
  return useQuery({
    queryKey: ["boardInfo", boardId],
    queryFn: () => fetchBoardInfoAPI(boardId),
    staleTime: 1000 * 60 * 1, // 1분
    retry: 2,
  });
};
// 하위 호환성을 위한 기존 함수들 (deprecated)
/** @deprecated usePostListInfiniteQuery 훅을 사용하세요 */
export const loadMorePosts = loadMorePostsAPI; 