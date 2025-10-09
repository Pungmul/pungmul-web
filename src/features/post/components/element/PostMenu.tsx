"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useRef, useState, memo } from "react";
import { Toast } from "@/shared/store";
import {
  postQueryKeys,
  useDeletePost,
  useLoadPostDetail,
} from "@/features/post";
import { alertStore } from "@/shared/store";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useReportPost } from "../../store";
import { useQueryClient } from "@tanstack/react-query";

function PostMenu({ isWriter }: { isWriter: boolean }) {
  const router = useRouter();

  const { postId } = useParams<{ postId: string }>();
  const queryClient = useQueryClient(); 

  const [isOpen, setOpen] = useState(false);

  const { data: postDetail } = useLoadPostDetail(Number(postId));
  const { mutate: deletePost } = useDeletePost();
  const { openModalToReport } = useReportPost();
  const Alert = alertStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isOpen)
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
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
    if (!postDetail) return;
    
    openModalToReport({
      postId: Number(postId),
      title: postDetail.title,
      author: postDetail.author,
    });
    setOpen(false); // 메뉴 닫기
  };

  const handleDeletePost = () => {
    deletePost(
      { postId: Number(postId) },
      {
        onSuccess: (_, postId) => {
          const revalidations = async () => {
            await queryClient.resetQueries({
              queryKey: postQueryKeys.list(),
              type: "all",
            });
            await queryClient.resetQueries({
              queryKey: ["boardInfo"],
              type: "all",
            });
            await queryClient.invalidateQueries({
              queryKey: postQueryKeys.detail(Number(postId)),
              refetchType: "all",
            });
          };
          return revalidations().then(() => {
            router.back();
            Toast.show({
              message: "게시글이 삭제되었습니다.",
            });
          });
        },
        onError: (error) => {
          Alert.alert({
            title: "오류",
            message: "삭제에 실패했습니다.",
            subMessage: error.message,
          });
        },
      }
    );
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative select-none cursor-pointer"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <EllipsisVerticalIcon className="size-[32px]" />
        {isOpen && (
          <ul
            className="absolute right-0 top-full px-3 py-2 border border-grey-300 mt-2 bg-background rounded-sm flex flex-col gap-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {isWriter && (
              <li
                className="w-12 text-right"
                onClick={() => {
                  const currentParams = new URLSearchParams(
                    window.location.search
                  ); // 현재 URL 쿼리 그대로 가져오기

                  currentParams.set("documentId", postId as string); // isPosting 추가

                  router.push(`/board/p?${currentParams.toString()}`, {
                    scroll: false,
                  });
                }}
              >
                수정
              </li>
            )}
            {!isWriter && (
              <li className="w-12 text-right" onClick={handleReportClick}>
                신고
              </li>
            )}
            {isWriter && (
              <li
                className="w-12 text-right text-red-400"
                onClick={() => {
                  Alert.confirm({
                    title: "게시글 삭제",
                    message: "게시글을 삭제하시겠습니까?",
                    confirmColor: "var(--color-red-400)",
                    onConfirm: handleDeletePost,
                  });
                }}
              >
                삭제
              </li>
            )}
          </ul>
        )}
      </div>
    </>
  );
}

export default memo(PostMenu);
