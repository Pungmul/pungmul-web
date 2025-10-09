import { useMutation } from "@tanstack/react-query";
import { deletePost } from "../api";

export const useDeletePost = () => {
  return useMutation({
    mutationFn: deletePost,
    onError: (error) => {
      console.error("게시글 삭제 중 에러:", error);
    },
  });
};

