import { PostDetail, PostLikeResponse } from "@/shared/types/post/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API 함수
export const likePostAPI = async (postId: number): Promise<PostLikeResponse> => {
  const response = await fetch(`post/${postId}/like`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("좋아요 업데이트 실패");
  }

  const data = await response.json();
  
  if (postId !== data.postId) {
    throw new Error("좋아요 업데이트 실패: 잘못된 게시물");
  }

  return data;
};

// React Query Hook
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePostAPI,
    onSuccess: (data, postId) => {
      // 게시글 상세 정보의 좋아요 수 업데이트
      queryClient.setQueryData(
        ["postDetail", postId],
        (oldData: PostDetail) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            likedNum: data.likedNum,
            isLiked: data.liked,
          };
        }
      );
      
      // 게시글 목록에서도 해당 게시글의 좋아요 수 업데이트
      return queryClient.invalidateQueries({
        queryKey: ["postList"],
      });
      
    },
    onError: (error) => {
      console.error("좋아요 업데이트 중 에러:", error);
    },
  });
};

// 하위 호환성을 위한 기존 함수 (deprecated)
/** @deprecated useLikePost 훅을 사용하세요 */
export const likePostRequest = likePostAPI; 