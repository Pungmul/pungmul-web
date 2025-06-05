"use client";

import { useMemo, useCallback } from "react";
import { debounce } from "lodash";

import { usePostListInfiniteQuery } from "@/features/board/api/boardInfo";
import PostBox from "@/features/board/post/components/PostBox";
import PostBoxSkelleton from "@/features/board/post/components/PostBoxSkelleton";
import DragScroll from "@/shared/components/DragScroll";
import { BoardData } from "@/shared/types/board/type";
import ObserveTrigger from "@/shared/components/ObserveTrigger";

export default function PostList({
  boardData,
  boardId,
}: {
  boardData: BoardData;
  boardId: number;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    usePostListInfiniteQuery(boardId);

  // 모든 페이지의 포스트를 하나의 배열로 합치기
  const allPosts = useMemo(() => {
    if (!data) return boardData.recentPostList.list;

    // 첫 번째 페이지는 서버에서 받은 초기 데이터와 중복될 수 있으므로 제외하고 시작
    return data.pages.flatMap((page) => page.list);
  }, [data, boardData.recentPostList.list]);

  // 디바운스된 실제 API 호출 함수
  const debouncedFetchNextPage = useCallback(
    debounce(
      async () => {
        if (!isFetchingNextPage && hasNextPage) {
          console.log("Loading next page...");
          await fetchNextPage();
        }
      },
      300,
      { leading: true, trailing: false }
    ),
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // 즉시 로딩 표시 + 디바운스된 API 호출
  const handleLoadMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      debouncedFetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, debouncedFetchNextPage]);

  if (error) {
    console.error("Error loading posts:", error);
  }

  if (!boardData) return null;

  return (
    <div className="flex flex-col overflow-y-auto">
      <div className="h-0">
        <button>새로 고침</button>
      </div>
      <DragScroll>
        <div
          className="w-full px-[16px] h-[64px] flex items-center gap-2 flex-row"
          style={{
            backgroundColor: "#F9F8FF",
          }}
        >
          <div className=" bg-red-50 flex flex-row w-full px-[12px] py-[8px] rounded-full items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={boardData.hotPost ? "#f87171" : "#fecaca"}
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
              />
            </svg>

            <div
              className={
                "text-md  font-semibold " +
                (boardData.hotPost ? "text-black" : "text-gray-300")
              }
            >
              {boardData.hotPost?.title || "핫한 게시글이 없습니다."}
            </div>
          </div>
        </div>
        {allPosts.map((post) => (
          <PostBox post={post} key={post.postId} />
        ))}
        {isFetchingNextPage && <PostBoxSkelleton length={3} />}
        <ObserveTrigger
          trigger={handleLoadMore}
          unmountCondition={!hasNextPage}
          triggerCondition={{
            rootMargin: "0px 0px 60px 0px",
          }}
        />
      </DragScroll>
    </div>
  );
}
