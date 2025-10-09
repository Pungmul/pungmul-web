import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../api";
import { postQueryKeys } from "../constant";
import { PostDetail } from '../types';

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,
    onSuccess: (data, postId) => {
      queryClient.setQueryData(
        postQueryKeys.detail(postId),
        (oldData: PostDetail | null | undefined) => {
          if (!oldData) {
            return oldData ?? null;
          }

          return {
            ...oldData,
            likedNum: data.likedNum,
            isLiked: data.liked,
          };
        }
      );

      return queryClient.invalidateQueries({
        queryKey: postQueryKeys.list(),
      });
    },
    onError: (error) => {
      console.error("좋아요 업데이트 중 에러:", error);
    },
  });
};

