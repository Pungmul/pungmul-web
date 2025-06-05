'use client';

import Link from "next/link";
import BoardList from "./BoardList";
import LastUpdateTime from "./LastUpdateTime";

interface BoardMainPageContentProps {
  boardList: any[];
}

export default function BoardMainPageContent({ boardList }: BoardMainPageContentProps) {
  return (
    <div className="flex flex-col h-full w-full ">
      <div
        className="w-full h-full flex-grow px-6 py-2"
        style={{ backgroundColor: "#F9F8FF" }}
      >
        <div className=" flex flex-col">
          <div
            style={{ marginLeft: 8, marginBottom: 12 }}
            className="text-xl font-semibold"
          >
            게시판
          </div>
          <div className= "px-[8px] pb-[8px]">
            <LastUpdateTime />
          </div>
          <div className="flex flex-col lg:flex-row" style={{ gap: 16 }}>
            <div className="py-3 px-2 border-0.5 border-white bg-white rounded-md flex flex-col flex-grow gap-2">
              <Link
                href={`/board/my-post`}
                className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
              >
                <div className="w-6 h-6 bg-slate-500" />
                <div style={{ fontSize: 17, color: "#666666" }}>내가 쓴 글</div>
              </Link>
              <Link
                href={`/board/1`}
                className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
              >
                <div className="w-6 h-6 bg-slate-500" />
                <div style={{ fontSize: 17, color: "#666666" }}>
                  내가 쓴 댓글
                </div>
              </Link>
              <Link
                href={`/board/1`}
                className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
              >
                <div className="w-6 h-6 bg-slate-500" />
                <div style={{ fontSize: 17, color: "#666666" }}>
                  좋아요 누른 글
                </div>
              </Link>
              <Link
                href={`/board/hot-post`}
                className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
              >
                <div className="w-6 h-6 bg-slate-500" />
                <div style={{ fontSize: 17, color: "#666666" }}>HOT 게시판</div>
              </Link>
            </div>
            <div className="flex-grow">
              <BoardList boardList={boardList} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 