"use client";
import Link from "next/link";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { useFrequentBoard } from "@/features/board/store";

export default function FrequentBoards() {
  const { boardList, removeBoard } = useFrequentBoard();

  if (boardList.length === 0) return null;
  return (
    <div className="flex flex-col lg:flex-row px-[24px] py-[4px] gap-[4px] lg:gap-[16px] lg:items-center">
      <h2 className="text-[16px] font-normal flex-shrink-0 text-grey-500">
        자주 가는 게시판
      </h2>
      <ul className="flex flex-row gap-[8px] overflow-x-auto w-fit list-none scrollbar-hide">
        {boardList.map((board) => (
          <li
            key={board.id}
            className="flex flex-row items-center gap-[8px] p-[8px] flex-shrink-0 rounded-[8px] bg-primary text-background"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeBoard(board);
              }}
            >
              <XMarkIcon className="w-[16px] h-[16px] cursor-pointer" />
            </button>
            <Link
              href={`/board/${board.id}`}
              className="text-[14px] cursor-pointer leading-[16px]"
              prefetch
            >
              {board.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
