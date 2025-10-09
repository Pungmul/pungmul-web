"use client";

import { WebViewLink } from "@/shared/components";
import { BriefBoardInfo } from "../../types"; 
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { memo, useCallback, useEffect, useState, useMemo } from "react";

interface BoardListProps {
  boardList: BriefBoardInfo[];
}

const BoardList = memo(function BoardList({ boardList }: BoardListProps) {
  const [bookmarkedBoardList, setBookmarkedBoardList] = useState<(number | string)[]>([]);

  const toggleBookmark = useCallback((board: BriefBoardInfo) => {
    setBookmarkedBoardList((prev) => {
      if (prev.includes(board.id)) {
        return prev.filter((id) => id !== board.id);
      } else {
        return [...prev, board.id];
      }
    });
  }, []);

  useEffect(() => {
    const bookmarkedBoard = localStorage.getItem("favoriteBoard");
    if (bookmarkedBoard) {
      setBookmarkedBoardList(JSON.parse(bookmarkedBoard));
    }
  }, []);

  useEffect(() => {
    return () => {
      localStorage.setItem(
        "favoriteBoard",
        JSON.stringify(bookmarkedBoardList)
      );
    };
  }, [bookmarkedBoardList]);

  const sortedBoardList = useMemo(() => {
    return [
      ...boardList,
    ].sort((a, b) => {
      const aBookmarked = bookmarkedBoardList.includes(a.id);
      const bBookmarked = bookmarkedBoardList.includes(b.id);

      if (aBookmarked && !bBookmarked) return -1;
      if (!aBookmarked && bBookmarked) return 1;

      if (typeof a.id === "number" && typeof b.id === "number") {
        return a.id - b.id;
      } else {
        return (a.id as string).localeCompare(b.id as string, "ko-KR");
      }
    });
  }, [boardList, bookmarkedBoardList]);

  return (
    <ul className="py-3 px-2 border-0.5 border-background bg-background rounded-md flex flex-col gap-2 list-none flex-grow">
      {sortedBoardList.map((board) => {
        const isBookmarked = bookmarkedBoardList.includes(board.id);
        return (
          <BoardListItem
            key={board.id}
            isBookmarked={isBookmarked}
            board={board}
            toggleBookmark={toggleBookmark}
          />
        );
      })}
    </ul>
  );
});

export default BoardList;

const BoardListItem = memo(
  ({
    isBookmarked,
    board,
    toggleBookmark,
  }: {
    isBookmarked: boolean;
    board: BriefBoardInfo;
    toggleBookmark: (board: BriefBoardInfo) => void;
  }) => {
    return (
      <li className="w-full px-[12px] py-[8px] flex flex-row items-end gap-[8px]">
        <div
          className="flex justify-center items-center size-[28px] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(board);
          }}
        >
          {isBookmarked ? (
            <StarIconSolid className="size-[24px]" color="#ffadad" />
          ) : (
            <StarIconOutline className="size-[24px]" color="#ffadad" />
          )}
        </div>
        <WebViewLink
          href={`/board/${board.id === 999999 ? "promote" : board.id}`}
          className="flex-grow text-[15px] text-grey-600"
          prefetch
        >
          {board.name}
        </WebViewLink>
      </li>
    );
  }
);

BoardListItem.displayName = "BoardListItem";
