import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Comment as CommentType } from "../model/index";

const postCommentAPI = async (id: number, comment: string, anonymity: boolean) => {
  const response = await fetch(`/board/post/${id}/comment`, {
    method: "POST",
    body: JSON.stringify({ content: comment, anonymity }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("댓글 작성 실패");

  return response.json();
};

export const usePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, comment, anonymity }: { postId: number; comment: string; anonymity: boolean }) =>
      postCommentAPI(postId, comment, anonymity),
    onSuccess: (newComment, variables) => {
      // 기존 댓글 목록 캐시를 가져와서 새 댓글을 추가
      queryClient.setQueryData(
        ["comments", variables.postId],
        (oldComments: CommentType[]) => {
          if (!oldComments) return [newComment];
          return [...oldComments, newComment];
        }
      );
    },
    onError: (error) => {
      console.error("댓글 작성 중 에러:", error);
    },
  });
};

