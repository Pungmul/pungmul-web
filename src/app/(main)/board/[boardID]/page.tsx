"use client";
import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";

import { PostBoxSkelleton } from "@/features/post";
import PostList from "@pThunder/features/post/components/widget/PostList";
import { useLoadBoardInfo } from "@/features/board/api";
import { PostingPage } from "@pThunder/features/post/components/widget/PostingPage";
import { PostDetailPage } from "@pThunder/features/post/components/widget/PostDetailPage";

export const dynamic = "force-dynamic";

export default function BoardPage() {
  const boardID = Number(useParams().boardID);
  const { data: boardData, isLoading } = useLoadBoardInfo(boardID);

  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", preventBack);
    return () => window.removeEventListener("popstate", preventBack);
  }, []);

  if (!isLoading && !boardData) {
    return notFound();
  }

  return (
    <>
      <section
        key="board-post-list-section"
        className={"relative flex flex-col w-full bg-white"}
      >
        {isLoading || !boardData ? (
          <PostBoxSkelleton length={8} />
        ) : (
          <PostList key="board-post-list" boardData={boardData} boardId={boardID} />
        )}
      </section>
      <PostDetailPage
        key="board-post-detail-page"
        boardName={boardData?.boardInfo.rootCategoryName || "알 수 없는 게시판"}
      />
      <PostingPage key="board-posting-page" />
    </>
  );
}
