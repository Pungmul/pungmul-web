"use client";
import "@/app/globals.css";

import { useCallback, useEffect, useRef, useState } from "react";

import { PaperAirplaneIcon, CheckIcon } from "@heroicons/react/24/outline";

import type { Comment as CommentType } from '../../types';
import { useCommentNavigation } from "../../hooks";
import {
  buildCommentTree,
  extractCommentData,
  handleCommentSuccess,
  handleReplySuccess,
} from "../../services";
import { usePostComment, usePostReply } from "../../queries";

import Comment from "../element/Comment";
import Reply from "../element/Reply";
import ReportCommentModal from "./ReportCommentModal";

interface CommentListProps {
  comments: CommentType[];
  postId: number;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  postId,
}) => {
  const [commentList, setCommentList] = useState<CommentType[]>(comments);
  const [isReplying, setReply] = useState<CommentType | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const commentsRef = useRef<Record<number, HTMLDivElement | null>>({});
  const { mutate: postComment } = usePostComment();
  const { mutate: postReply } = usePostReply();
  const formRef = useRef<HTMLFormElement>(null);
  const { moveToHash } = useCommentNavigation({
    commentId: null,
    commentsRef,
  });

  // props로 받은 comments가 변경되면 commentList 상태도 업데이트
  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const adjustHeight = () => {
    if (commentInputRef.current) {
      commentInputRef.current.style.height = "auto";
      commentInputRef.current.style.height = `${commentInputRef.current.scrollHeight}px`;
    }
  };

  const submitComment = useCallback(
    (comment: string) => {
      if (!comment.trim()) return;
      
      const anonymity = true; // 기본값
      commentInputRef.current!.value = "";
      adjustHeight();
      
      if (isReplying) {
        postReply(
          {
            postId,
            comment,
            anonymity,
            parentId: isReplying.commentId,
          },
          {
            onSuccess: (newReply) => {
              handleReplySuccess(
                newReply,
                setCommentList,
                setReply,
                commentInputRef
              );
            },
          }
        );
      } else {
        postComment(
          { postId, comment, anonymity },
          {
            onSuccess: (newComment) => {
              handleCommentSuccess(newComment, setCommentList, commentInputRef);
            },
          }
        );
      }
    },
    [isReplying, postId, postComment, postReply, adjustHeight, setCommentList, setReply]
  );

  const CommentHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const { comment } = extractCommentData(form);
      submitComment(comment);
    },
    [submitComment]
  );

  const ReplyHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isReplying) {
        alert("댓글을 입력해주세요");
        return;
      }

      const form = e.currentTarget;
      const { comment } = extractCommentData(form);
      submitComment(comment);
    },
    [isReplying, submitComment]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    },
    [submitComment]
  );

  return (
    <>
      <div className="w-full flex-col flex flex-grow h-full bg-grey-100">
        <div className="flex-col flex flex-grow">
          {buildCommentTree(commentList).map((comment) => (
            <div
              ref={(el) => {
                commentsRef.current[comment.commentId] = el;
              }}
              key={comment.commentId}
              id={comment.commentId.toString()}
              className="w-full bg-background "
            >
              <Comment
                comment={comment}
                isReplying={isReplying}
                setReply={setReply}
                commentInputRef={commentInputRef}
              />
              <div className="w-full flex-col flex">
                {comment.replies?.map((reply) => (
                  <Reply key={reply.commentId} reply={reply} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <form
          ref={formRef}
          onSubmit={isReplying ? ReplyHandler : CommentHandler}
          className="sticky bottom-0 w-fullshadow-up-md"
        >
          {isReplying && (
            <div
              style={{
                paddingLeft: 24,
                paddingRight: 24,
                height: 32,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              }}
              onClick={moveToHash}
            >
              <div className="text-[12px] text-primary">
                @{isReplying.userName}
              </div>
              <div
                className="w-6 h-6 p-1 cursor-pointer bg-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setReply(null);
                }}
              ></div>
            </div>
          )}
          <div className=" bg-background items-center px-3 py-3 ">
            <div className="flex flex-row items-end px-4 py-2 rounded-md bg-grey-100">
              <label
                htmlFor="anonymity"
                className="flex flex-row gap-2 items-center cursor-pointer py-2"
              >
                <input
                  type="checkbox"
                  defaultChecked={true}
                  name="anonymity"
                  id="anonymity"
                  className="hidden peer"
                />
                <div className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center bg-primary">
                  <CheckIcon className="w-[12px] h-[12px] text-white stroke-[4px]" />
                </div>
                <div className="block w-5 h-5 bg-background peer-checked:hidden rounded-sm" />
                <div className="text-grey-400 peer-checked:text-grey-800 text-[12px]">
                  익명
                </div>
              </label>
              <textarea
                ref={commentInputRef}
                onChange={adjustHeight}
                name="comment"
                placeholder="댓글을 입력하세요..."
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none px-4 py-2 flex-grow text-[12px] resize-none overflow-y-auto min-h-[20px] max-h-[120px] scrollbar-thin scrollbar-thumb-grey-300 scrollbar-track-transparent hover:scrollbar-thumb-grey-400"
                rows={1}
              />
              <div className="flex flex-row items-center justify-center py-2">
                <button type="submit" className="w-6 h-6 p-1">
                  <PaperAirplaneIcon className="text-primary" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ReportCommentModal />
    </>
  );
};

export default CommentList;
