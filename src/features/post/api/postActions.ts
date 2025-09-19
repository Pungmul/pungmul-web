import { useMutation } from "@tanstack/react-query";
// API 함수들
const createPostAPI = async ({
  boardId,
  formData,
}: {
  boardId: number;
  formData: FormData;
}) => {
  const response = await fetch(`/api/posts?boardId=${boardId}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) throw new Error("게시글 작성 실패");

  return response.json();
};

const updatePostAPI = async ({
  postId,
  formData,
}: {
  postId: number;
  formData: FormData;
}) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) throw new Error("게시글 수정 실패");

  return response.json();
};

// React Query Hooks
export const useCreatePost = () => {
  return useMutation({
    mutationFn: createPostAPI,
    onError: (error) => {
      console.error("게시글 작성 중 에러:", error);
    },
  });
};

export const useUpdatePost = () => {

  return useMutation({
    mutationFn: updatePostAPI,
    onError: (error) => {
      console.error("게시글 수정 중 에러:", error);
    },
  });
};
