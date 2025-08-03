"use client";
import { useFrequentBoard } from "@pThunder/store/board/frequantBoard";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function FrequentBoards() {
  const { boardList, removeBoard } = useFrequentBoard();
  const router = useRouter();
  console.log(boardList);

  if (boardList.length === 0) return null;
  return (
    <div className="flex flex-row px-[24px] py-[4px] gap-[16px]">
      <h2 className="text-[16px] font-normal flex-shrink-0 text-[#AAA]">자주 가는 게시판</h2>
      <div className="flex flex-row gap-[8px] overflow-x-auto w-fit"
        style={{ scrollbarWidth: "none" }}
      >
        {boardList.map((board) => (
          <div
            key={board.id}
            className="flex flex-row items-center gap-[8px] p-[4px] flex-shrink-0 rounded-[8px] bg-[#E3D7FF] text-[#663399]"
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
            <span
              className="text-[14px] cursor-pointer"
              onClick={() => router.push(`/board/${board.id}`)}
            >
              {board.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
