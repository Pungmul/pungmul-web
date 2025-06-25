import { PostDetail } from "@/shared/types/post/type";
import { useQuery } from "@tanstack/react-query";

// API 함수
export const loadPostDetailAPI = async (postId: number): Promise<PostDetail> => {
  const response = await fetch(`/board/post?postId=${postId}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("게시글 로드 실패: " + response.status);

  const { response: data } = await response.json();
  return data;
};

// React Query Hook
export const useLoadPostDetail = (postId: number) => {
  return useQuery({
    queryKey: ["postDetail", postId],
    queryFn: () => loadPostDetailAPI(postId),
    staleTime: 1000 * 60 * 1, // 1분
    retry: 2,
  });
};

// 하위 호환성을 위한 기존 함수 (deprecated)
/** @deprecated useLoadPostDetail 훅을 사용하세요 */
export const loadPostDetail = loadPostDetailAPI;
export const loadPostFetch = loadPostDetailAPI; 