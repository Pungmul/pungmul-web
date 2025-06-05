"use client";

import { WebViewLink } from "@/features/board/shared/components";
import { BoardInfo } from "@/features/board/board/components/utils";

interface BoardListProps {
  boardList: BoardInfo[];
}

export default function BoardList({ boardList }: BoardListProps) {

  return (
    <div className="py-3 px-2 border-0.5 border-white bg-white rounded-md flex flex-col gap-2">
      {boardList.map((board) => {
        return (
          <WebViewLink
            href={`/board/${board.id}`}
            key={board.id}
            className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
            prefetch
          >
            <div className="w-6 h-6 bg-slate-500" />
            <div style={{ fontSize: 17, color: "#666666" }}>{board.name}</div>
          </WebViewLink>
        );
      })}
    </div>
  );
}
