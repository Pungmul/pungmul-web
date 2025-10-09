import { useMutation } from "@tanstack/react-query";
import { createPost } from "../api";

export const useCreatePost = () => {
  return useMutation({
    mutationFn: createPost,
    onError: (error) => {
      console.error("게시글 작성 중 에러:", error);
    },
  });
};

