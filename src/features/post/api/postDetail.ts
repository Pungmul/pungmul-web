import { PostDetail } from "@/shared/types/post/type";
import { useSuspenseQuery } from "@tanstack/react-query";


export const loadPostDetailAPI = async (postId: number): Promise<PostDetail> => {
  const response = await fetch(`/board/post?postId=${postId}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("게시글 로드 실패: " + response.status);

  const { response: data } = await response.json();
  return data;
};

// React Query Hook
export const useLoadPostDetail = (postId: number | null) => {
  return useSuspenseQuery({
    queryKey: ["postDetail", `post-${postId}`],
    queryFn: () => {
      if (!postId) return null;
      return loadPostDetailAPI(postId);
    },
    staleTime: 1000 * 5, // 5초로 변경
    retry: 2,
    refetchOnMount: true, // 컴포넌트 마운트 시 refetch
    refetchOnWindowFocus: true, // 창 포커스 시 refetch
  });
};
