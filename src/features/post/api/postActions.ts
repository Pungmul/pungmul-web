import { useMutation, useQueryClient } from "@tanstack/react-query";

// API 함수들
export const createPostAPI = async ({
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

export const updatePostAPI = async ({
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
  const queryClient = useQueryClient();

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePostAPI,
    onSuccess: (data, variables) => {
      // 게시글 상세 정보 및 목록 무효화
      queryClient.invalidateQueries({
        queryKey: ["postDetail", variables.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["postList", variables.boardId],
      });
      console.log("게시글 수정 성공:", data);
    },
    onError: (error) => {
      console.error("게시글 수정 중 에러:", error);
    },
  });
};

// 하위 호환성을 위한 기존 함수들 (deprecated)
/** @deprecated useCreatePost 훅을 사용하세요 */
export const postContextRequest = createPostAPI;
/** @deprecated useUpdatePost 훅을 사용하세요 */
export const patchContextRequest = updatePostAPI; 