import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@pThunder/core";

// API 함수들
const createPostAPI = async ({
  boardId,
  formData,
}: {
  boardId: number;
  formData: FormData;
}) => {
  const response = await fetch(`/board/${boardId}/post/api`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) throw new Error("게시글 작성 실패");

  return response.json();
};

const updatePostAPI = async ({
  boardId,
  postId,
  formData,
}: {
  boardId: number;
  postId: number;
  formData: FormData;
}) => {
  const response = await fetch(`/board/${boardId}/post/api?postId=${postId}`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) throw new Error("게시글 수정 실패");

  return response.json();
};

// React Query Hooks
export const useCreatePost = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: createPostAPI,
    onSuccess: (data, variables) => {
      // 게시판 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["postList", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["boardInfo", variables.boardId],
      });
      console.log("게시글 작성 성공:", data);
    },
    onError: (error) => {
      console.error("게시글 작성 중 에러:", error);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: updatePostAPI,
    onSuccess: (data, variables) => {
      // 게시글 상세 정보 및 목록 무효화
      console.log("variables", variables);
      queryClient.invalidateQueries({
        queryKey: ["postDetail", Number(variables.postId)],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["postList", variables.boardId],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["boardInfo", variables.boardId],
        refetchType: "all",
      });
      console.log("게시글 수정 성공:", data);
    },
    onError: (error) => {
      console.error("게시글 수정 중 에러:", error);
    },
  });
};
