import { useMutation, useQueryClient } from "@tanstack/react-query";

// API 함수
const postReplyAPI = async (
  id: number,
  comment: string,
  parentId: number,
  anonymity: boolean
) => {
  const response = await fetch(`/board/post/${id}/comment`, {
    method: "POST",
    body: JSON.stringify({ content: comment, parentId, anonymity }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("대댓글 작성 실패");

  return response.json();
};

// React Query Hook
export const usePostReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      postId, 
      comment, 
      parentId,
      anonymity
    }: { 
      postId: number; 
      comment: string; 
      parentId: number;
      anonymity: boolean;
    }) => postReplyAPI(postId, comment, parentId, anonymity),
    onSuccess: (newReply, variables) => {
      // 기존 댓글 목록 캐시를 가져와서 새 대댓글을 추가
      queryClient.setQueryData(
        ["comments", variables.postId],
        (oldComments: any) => {
          if (!oldComments) return [newReply];
          return [...oldComments, newReply];
        }
      );
      console.log("대댓글 작성 성공:", newReply);
    },
    onError: (error) => {
      console.error("대댓글 작성 중 에러:", error);
    },
  });
};