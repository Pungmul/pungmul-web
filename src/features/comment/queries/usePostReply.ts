import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Comment as CommentType } from '../types';
import { postReply } from "../api/postReply";

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
    }) => postReply(postId, comment, parentId, anonymity),
    onSuccess: (newReply, variables) => {
      // 기존 댓글 목록 캐시를 가져와서 새 대댓글을 추가
      queryClient.setQueryData(
        ["comments", variables.postId],
        (oldComments: CommentType[]) => {
          if (!oldComments) return [newReply];
          return [...oldComments, newReply];
        }
      );
    },
  });
};
