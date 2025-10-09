import { useMutation } from "@tanstack/react-query";
import { updatePost } from "../api";

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: updatePost,
    onError: (error) => {
      console.error("게시글 수정 중 에러:", error);
    },
  });
};

