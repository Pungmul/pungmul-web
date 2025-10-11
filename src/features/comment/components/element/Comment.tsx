import { useCallback } from "react";

import { HandThumbUpIcon } from "@heroicons/react/24/outline";

import { CommentOutline } from "@/shared/components/Icons";

import type { Comment as CommentType } from "../../types";
import CommentMenu from "./CommentMenu";
import { Alert, Toast } from "@pThunder/shared";
import { josa } from "es-hangul";

const Comment = ({
  comment,
  isReplying,
  setReply,
  commentInputRef,
}: {
  comment: CommentType;
  isReplying: CommentType | null;
  setReply: (comment: CommentType) => void;
  commentInputRef: React.RefObject<HTMLTextAreaElement | null>;
}) => {
  console.log("comment render");
  return (
    <div
      className={
        "w-full py-[16px] px-[24px] gap-[8px] flex flex-col border-b border-b-grey-300 " +
        (isReplying?.commentId == comment.commentId
          ? " bg-primary-dark"
          : " bg-background")
      }
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-1 items-center text-[12px]">
          <div>{comment.userName}</div>
          <div className="text-grey-400">{comment.createdAt}</div>
        </div>
        <div className="flex flex-row items-center">
          <div
            className="w-[32px] cursor-pointer flex items-center justify-center"
            onClick={useCallback((e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              Alert.confirm({
                title: "대댓글 작성",
                message: "대댓글을 작성하시겠습니까?",
                onConfirm: () => {
                  commentInputRef.current?.focus();
                  setReply(comment);
                },
              });
            }, [])}
          >
            <CommentOutline className="size-6 text-grey-400" />
          </div>
          <div
            className="w-[32px] cursor-pointer flex items-center justify-center"
            onClick={useCallback((e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              Alert.confirm({
                title: "추천",
                message: "이 댓글을 추천하시겠습니까?",
                onConfirm: () => {
                  Toast.show({
                    message:
                      josa(comment.content.substring(0, 10), "을/를") +
                      "추천했어요",
                    type: "success",
                  });
                },
              });
            }, [])}
          >
            <HandThumbUpIcon className="size-6 text-red-500" />
          </div>
          <div className="w-[32px] cursor-pointer">
            <CommentMenu comment={comment} />
          </div>
        </div>
      </div>
      <div className="text-[13px] text-grey-800 whitespace-pre-wrap">
        {comment.content}
      </div>
    </div>
  );
};

export default Comment;
