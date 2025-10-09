"use client";
import { notFound, useParams } from "next/navigation";

import { PostBoxSkelleton } from "@/features/post";
import { PostList } from "@/features/post";
import { useLoadBoardDetails } from "@/features/board/queries";
import HotPostBanner from "@/features/board/components/element/HotPostBanner";
import { usePostList } from "@/features/board/hooks/usePostList";
// import { useSearchPostList } from "@/features/board/hooks/useSearchPostList";
export const dynamic = "force-dynamic";

export default function BoardPage() {
  const boardID = Number(useParams().boardID);
  const { data: boardData, isLoading } = useLoadBoardDetails(boardID);
  const postListData = usePostList({ boardId: boardID, boardData });

  if (!isLoading && !boardData) {
    return notFound();
  }

  return (
    <section
      key="board-post-list-section"
      className="relative flex flex-col w-full bg-background"
    >
      {isLoading || !boardData ? (
        <PostBoxSkelleton length={8} />
      ) : (
        <>
          <HotPostBanner hotPost={boardData.hotPost} />
          <PostList
            key="board-post-list"
            posts={postListData?.posts || []}
            isLoading={postListData?.isLoading || false}
            hasNextPage={postListData?.hasNextPage || false}
            onLoadMore={postListData?.onLoadMore || (() => {})}
          />
        </>
      )}
    </section>
  );
}
