"use client";
import "@/app/globals.css";

import { useCallback, useEffect, useRef, useState } from "react";

import sendIcon from "@public/icons/sendIcon.svg";
import checkMark from "@public/icons/checkMark.svg";
import Image from "next/image";
import { usePostComment, usePostReply } from "@pThunder/features/board/comment/api";
import Comment from "./Comment";
import { useSearchParams } from "next/navigation";
import Reply from "./Reply";
import { Comment as CommentType } from "@/shared/types/comment/type";
import { ReportCommentProvider } from "@/store/comment/ReportCommentContext";

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
  const commentInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const commentId = searchParams.get("commentId");
  const { mutate: postComment } = usePostComment();
  const { mutate: postReply } = usePostReply();

  const CommentHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget;
      const comment = new FormData(form).get("comment") as string;
      const anonymity = new FormData(form).get("anonymity") as string;

      console.log(comment, anonymity);

      postComment(
        { postId, comment, anonymity: anonymity === "true" },
        {
          onSuccess: (newComment) => {
            // 로컬 상태에 새 댓글 추가
            setCommentList((prev) => [...prev, newComment]);
            // 입력 필드 초기화
            if (commentInputRef.current) {
              commentInputRef.current.value = "";
            }
          },
        }
      );
    },
    [postId, postComment]
  );

  const ReplyHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const comment = new FormData(form).get("comment") as string;
      const anonymity = new FormData(form).get("anonymity") as string;

      if (!isReplying) {
        alert("댓글을 입력해주세요");
        return;
      }

      postReply(
        {
          postId,
          comment,
          anonymity: anonymity === "true",
          parentId: isReplying.commentId,
        },
        {
          onSuccess: (newReply) => {
            // 로컬 상태에 새 대댓글 추가
            setCommentList((prev) => [...prev, newReply]);
            // 답글 모드 해제 및 입력 필드 초기화
            setReply(null);
            if (commentInputRef.current) {
              commentInputRef.current.value = "";
            }
          },
        }
      );
    },
    [isReplying, postId, postReply]
  );

  const buildCommentTree = (commentArray: CommentType[]): CommentType[] => {
    const commentMap = new Map<number, CommentType>();
    const rootComments: CommentType[] = [];

    // 각 댓글을 ID 기반으로 매핑 (불변성을 유지하면서 새로운 객체 생성)
    commentArray.forEach((comment) => {
      commentMap.set(comment.commentId, { ...comment, replies: [] });
    });

    // 모든 댓글을 순회하여 부모-자식 관계 구성
    commentArray.forEach((comment) => {
      if (comment.parentId === null) {
        rootComments.push(commentMap.get(comment.commentId)!);
      } else {
        const parentComment = commentMap.get(comment.parentId);
        if (parentComment) {
          parentComment.replies.push(commentMap.get(comment.commentId)!);
        }
      }
    });

    return rootComments;
  };

  const moveToHash = () => {
    if (commentId) {
      const element = document.getElementById(commentId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    moveToHash();
  }, [searchParams]);

  // props로 받은 comments가 변경되면 commentList 상태도 업데이트
  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  return (
    <ReportCommentProvider>
      <div className="w-full flex-col flex flex-grow h-full">
        <div className="flex-col flex flex-grow">
          {buildCommentTree(commentList).map((comment) => (
            <div
              key={comment.commentId}
              id={comment.commentId.toString()}
              className="w-full bg-white "
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
              <div style={{ fontSize: 12, color: "#816DFF" }}>
                @{isReplying.userName}
              </div>
              <div
                style={{
                  width: 24,
                  height: 24,
                  cursor: "pointer",
                  backgroundColor: "#816DFF",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setReply(null);
                }}
              ></div>
            </div>
          )}
          <div className=" bg-white items-center px-2 py-2 ">
            <div
              className="flex flex-row items-center px-4 py-1 rounded-full"
              style={{ backgroundColor: "#F9F9F9" }}
            >
              <label
                htmlFor="anonymity"
                className="flex flex-row gap-2 items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  defaultChecked={true}
                  name="anonymity"
                  id="anonymity"
                  className="hidden peer"
                />
                <div
                  className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
                  style={{ backgroundColor: "#816DFF" }}
                >
                  <Image src={checkMark} width={12} alt="" />
                </div>
                <div className="block w-5 h-5 bg-white peer-checked:hidden rounded-sm" />
                <div
                  style={{ fontSize: 12 }}
                  className="text-gray-400 peer-checked:text-black"
                >
                  익명
                </div>
              </label>
              <input
                ref={commentInputRef}
                type="text"
                name="comment"
                style={{ fontSize: 12 }}
                placeholder="댓글을 입력하세요..."
                className="bg-transparent outline-none px-2 py-1 flex-grow"
              />
              <button type="submit" className="w-6 h-6 p-1">
                <Image src={sendIcon} width={32} alt="" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </ReportCommentProvider>
  );
};

export default CommentList;
