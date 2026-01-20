"use client";
import { notFound, useParams } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { PostBoxSkelleton } from "@/features/post";
import { PostList } from "@/features/post";
import { useLoadBoardDetails } from "@/features/board/queries";
import HotPostBanner from "@/features/board/components/element/HotPostBanner";
import { usePostList } from "@/features/board/hooks/usePostList";
import { LinkChipButton, ListEmptyView } from "@/shared/components";
// import { useSearchPostList } from "@/features/board/hooks/useSearchPostList";
export const dynamic = "force-dynamic";

function BoardPostListEmpty({ boardId }: { boardId: number }) {
  return (
    <ListEmptyView
      message="게시판에 게시글이 없어요."
      action={
        <LinkChipButton
          href={`/board/p?boardId=${boardId}`}
          filled
          className="inline-flex items-center gap-1"
        >
          이 게시판의 첫 글 쓰기
          <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />
        </LinkChipButton>
      }
    />
  );
}

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
            ListEmptyComponent={<BoardPostListEmpty boardId={boardID} />}
          />
        </>
      )}
    </section>
  );
}
