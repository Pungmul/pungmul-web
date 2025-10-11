"use client";

import { throttle } from "lodash";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import type { Comment as CommentType } from "../../types";
import { reportCommentStore } from "../../store/reportCommentStore";
import { useDeleteComment } from "../../queries";
import { Alert } from "@pThunder/shared";

interface CommentMenuProps {
  comment: CommentType;
}

function CommentMenu({ comment }: CommentMenuProps) {
  const { openModalToReport } = reportCommentStore.getState();
  const [isOpen, setOpen] = useState(false);
  const [isBelowHalf, setIsBelowHalf] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { mutate: deleteComment } = useDeleteComment();

  const router = useRouter();
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isOpen)
        if (
          targetRef.current &&
          !targetRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const handleReportClick = () => {
    openModalToReport(comment);
    setOpen(false); // 메뉴 닫기
  };

  const checkPosition = throttle(() => {
    if (!targetRef.current) return;

    const rect = targetRef.current.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      setOpen(false);
      return;
    }

    const viewportMiddle = (window.innerHeight / 3) * 2;
    const isBelow = rect.top > viewportMiddle;

    setIsBelowHalf(isBelow);
  }, 1000);

  const handleDeleteClick = () => {

    Alert.confirm({
      title: "삭제",
      message: "정말 삭제하시겠습니까?",
      onConfirm: () => {
        deleteComment(comment.commentId, {
          onSuccess: () => router.refresh(),
        });
      },
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkPosition, {
      passive: true,
      capture: true,
    });
    return () => {
      window.removeEventListener("scroll", checkPosition);
    };
  }, [checkPosition]); // ✅ isVisible이 변경될 때만 실행

  return (
    <>
      <div
        ref={targetRef}
        className={
          "relative select-none cursor-pointer w-full h-full flex justify-center items-center p-[4px]"
        }
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <EllipsisVerticalIcon className="size-[24px]" />
        {isOpen && (
          <ul
            className={`absolute right-0 px-3 py-2 border border-grey-200 bg-background rounded-sm flex flex-col gap-2 z-10 ${
              isBelowHalf ? " -top-[112px] mb-1" : " top-full mt-1"
            }`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <li className="w-12 text-right text-grey-800">수정</li>
            <li className="w-12 text-right text-grey-800" onClick={handleReportClick}>
              신고
            </li>
            <li
              className="w-12 text-right text-red-400"
              onClick={handleDeleteClick}
            >
              삭제
            </li>
          </ul>
        )}
      </div>
    </>
  );
}

export default CommentMenu;
