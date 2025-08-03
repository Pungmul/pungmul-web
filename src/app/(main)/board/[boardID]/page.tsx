"use client";
import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";

import PostBoxSkelleton from "@/features/board/post/components/PostBoxSkelleton";

import PostList from "@/features/board/post/components/PostList";
import { useLoadBoardInfo } from "@/features/board/api";

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
    <section
      key="board-post-list-section"
      className={"relative flex flex-col w-full bg-white"}
    >
      {isLoading || !boardData ? (
        <PostBoxSkelleton length={8} />
      ) : (
        <PostList boardData={boardData} boardId={boardID} />
      )}
    </section>
  );
}
