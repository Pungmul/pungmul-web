import { useCallback, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Comment as CommentType } from '../types';
import { usePostComment, usePostReply } from "../queries";
import { extractCommentData, handleCommentSuccess, handleReplySuccess } from "../services";

interface UseCommentHandlersProps {
  postId: number;
  comments: CommentType[];
}

export const useCommentHandlers = ({ postId, comments }: UseCommentHandlersProps) => {
  const [commentList, setCommentList] = useState<CommentType[]>(comments);
  const [isReplying, setReply] = useState<CommentType | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();
  const commentId = searchParams.get("commentId");
  const commentsRef = useRef<Record<number, HTMLDivElement | null>>({});
  const { mutate: postComment } = usePostComment();
  const { mutate: postReply } = usePostReply();

  const CommentHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget;
      const { comment, anonymity } = extractCommentData(form);

      postComment(
        { postId, comment, anonymity },
        {
          onSuccess: (newComment) => {
            
            handleCommentSuccess(newComment, setCommentList, commentInputRef);
          },
        }
      );
    },
    [postId, postComment]
  );

  const ReplyHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!isReplying) {
        alert("댓글을 입력해주세요");
        return;
      }

      const form = e.currentTarget;
      const { comment, anonymity } = extractCommentData(form);

      postReply(
        {
          postId,
          comment,
          anonymity,
          parentId: isReplying.commentId,
        },
        {
          onSuccess: (newReply) => {
            handleReplySuccess(newReply, setCommentList, setReply, commentInputRef);
          },
        }
      );
    },
    [isReplying, postId, postReply]
  );

  return {
    commentList,
    setCommentList,
    isReplying,
    setReply,
    commentInputRef,
    commentId,
    commentsRef,
    CommentHandler,
    ReplyHandler,
  };
};
