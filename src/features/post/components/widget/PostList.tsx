"use client";

import { useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";

import { usePostListInfiniteQuery } from "@/features/board/api/boardInfo";
import { PostBox, PostBoxSkelleton } from "@/features/post";
import { BoardData } from "@/shared/types/board/type";
import ObserveTrigger from "@/shared/components/ObserveTrigger";
import { useFrequentBoard } from "@pThunder/store/board/frequantBoard";
import { FireIcon } from "@heroicons/react/24/outline";

export default function PostList({
  boardData,
  boardId,
}: {
  boardData: BoardData;
  boardId: number;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    usePostListInfiniteQuery(boardId);

  const { visitBoard } = useFrequentBoard();

  useEffect(() => {
    visitBoard({ id: boardId, name: boardData.boardInfo.rootCategoryName });
  }, []);

  // 모든 페이지의 포스트를 하나의 배열로 합치기
  const allPosts = useMemo(() => {
    if (!data) return boardData.recentPostList.list;

    // 첫 번째 페이지는 서버에서 받은 초기 데이터와 중복될 수 있으므로 제외하고 시작
    return data.pages.flatMap((page) => page.list);
  }, [data, boardData.recentPostList.list]);

  // 디바운스된 실제 API 호출 함수
  const debouncedFetchNextPage = useMemo(
    () =>
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
    <div className="flex flex-col w-full max-w-full">
      <div
        className="w-full px-[16px] h-[64px] flex items-center gap-2 flex-row bg-[#F9F8FF] md:bg-transparent"
      >
        <div className=" bg-red-50 flex flex-row w-full px-[12px] py-[8px] rounded-full items-center gap-2">
          <FireIcon
            className="w-[24px] h-[24px]"
            style={{
              color: boardData.hotPost ? "#f87171" : "#fecaca",
            }}
          />
          <div
            className={
              "text-md font-semibold " +
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
    </div>
  );
}
