"use client";

import { WebViewLink } from "@/features/board/shared/components";
import { BoardInfo } from "@/features/board/board/components/utils";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface BoardListProps {
  boardList: BoardInfo[];
}

export default function BoardList({ boardList }: BoardListProps) {
  const [bookmarkedBoardList, setBookmarkedBoardList] = useState<number[]>([]);

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

  return (
    <ul className="py-3 px-2 border-0.5 border-white bg-white rounded-md flex flex-col gap-2 list-none">
      {boardList
        .sort((a, b) => {
          const aBookmarked = bookmarkedBoardList.includes(a.id);
          const bBookmarked = bookmarkedBoardList.includes(b.id);

          if (aBookmarked && !bBookmarked) return -1;
          if (!aBookmarked && bBookmarked) return 1;

          return a.id - b.id;
        })
        .map((board) => {
          const isBookmarked = bookmarkedBoardList.includes(board.id);
          return (
            <li key={board.id}>
              <WebViewLink
                href={`/board/${board.id}`}
                className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                prefetch
              >
                <div
                  className="w-6 h-6 flex items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (isBookmarked) {
                      setBookmarkedBoardList(
                        bookmarkedBoardList.filter(
                          (id: number) => id !== board.id
                        )
                      );
                    } else {
                      setBookmarkedBoardList([
                        ...bookmarkedBoardList,
                        board.id,
                      ]);
                    }
                  }}
                >
                  {isBookmarked ? (
                    <StarIconSolid className="size-6" color="#ffadad" />
                  ) : (
                    <StarIconOutline className="size-6" color="#ffadad" />
                  )}
                </div>
                <div className="text-[17px] text-gray-600 font-[200]">
                  {board.name}
                </div>
              </WebViewLink>
            </li>
          );
        })}
    </ul>
  );
}
