"use client";

import { throttle } from "lodash";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { useReportComment } from "@pThunder/features/comment/store/ReportCommentStore";
import { Comment as CommentType } from "../../model/index";
import { useDeleteComment } from "../../../comment/api/deleteComment";

interface CommentMenuProps {
  comment: CommentType;
}

function CommentMenu({ comment }: CommentMenuProps) {
  const { openModalToReport } = useReportComment();
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
    deleteComment(comment.commentId, {
      onSuccess: () => router.refresh(),
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
          "relative select-none cursor-pointer w-full h-full flex justify-center items-center"
        }
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          />
        </svg>
        {isOpen && (
          <ul
            className={`absolute right-0 px-3 py-2 border bg-white rounded-sm flex flex-col gap-2 z-10 ${
              isBelowHalf ? " -top-[112px] mb-1" : " top-full mt-1"
            }`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <li className="w-12 text-right">수정</li>
            <li className="w-12 text-right" onClick={handleReportClick}>
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
