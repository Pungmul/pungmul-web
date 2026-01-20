"use client";
import { PostBoxSkelleton } from "@/features/post";
import { PostList } from "@/features/post";
import { ListEmptyView } from "@/shared/components";

import { useSearchPostList } from "@/features/board";

export default function SearchResult({
  boardID,
  keyword,
}: {
  boardID: number;
  keyword: string;
}) {
  const { posts, isLoading, isFetching, hasNextPage, onLoadMore } =
    useSearchPostList({
      boardId: boardID,
      keyword: keyword || "",
      size: 10,
    });

  return (
    <main className="flex flex-col w-full bg-background h-full relative">
      <h1 className="px-6 text-xl font-bold text-grey-600">
        {keyword}에 대한 검색 결과
      </h1>
      <section
        key="board-post-list-section"
        className="relative flex flex-col w-full bg-background flex-grow"
      >
        {!keyword || isLoading || !posts ? (
          <PostBoxSkelleton length={8} />
        ) : (
          <>
            <PostList
              key="board-post-list"
              posts={posts || []}
              isLoading={isFetching || false}
              hasNextPage={hasNextPage || false}
              onLoadMore={onLoadMore || (() => {})}
              ListEmptyComponent={
                <DefaultSearchListEmptyComponent keyword={keyword || ""} />
              }
            />
          </>
        )}
      </section>
    </main>
  );
}

function DefaultSearchListEmptyComponent({
  keyword,
}: {
  keyword: string;
}): React.ReactNode {
  return (
    <ListEmptyView message={`"${keyword}"에 대한 검색 결과가 없어요.`} />
  );
}
  