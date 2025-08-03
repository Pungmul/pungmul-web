"use client";

import Link from "next/link";
import BoardList from "./BoardList";
import LastUpdateTime from "./LastUpdateTime";
import { BoardInfo } from "@/features/board/board/components/utils";

import { HandThumbUpIcon, FireIcon } from "@heroicons/react/24/solid";
import { ChatBubbleBottomCenterTextIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

interface BoardMainPageContentProps {
  boardList: BoardInfo[];
}

export default function BoardMainPageContent({
  boardList,
}: BoardMainPageContentProps) {
  return (
    <div className="flex flex-col h-full w-full ">
      <div
        className="w-full h-full flex-grow px-6 py-2"
        style={{ backgroundColor: "#F9F8FF" }}
      >
        <div className=" flex flex-col">
          <div className="text-[22px] font-semibold p-[4px]">게시판</div>
          <div className="px-[8px] pb-[8px]">
            <LastUpdateTime />
          </div>
          <div className="flex flex-col lg:flex-row" style={{ gap: 16 }}>
            <ul className="py-3 px-2 border-0.5 border-white bg-white rounded-md flex flex-col flex-grow gap-2 list-none">
              <li key="my-post">
                <Link
                  href={`/board/my-post`}
                  className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <PencilSquareIcon className="size-6" />
                  </div>
                  <div className="text-[17px] text-gray-600 font-[200]">
                    내가 쓴 글
                  </div>
                </Link>
              </li>
              <li key="my-comment">
                <Link
                  href={`/board/1`}
                  className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <ChatBubbleBottomCenterTextIcon className="size-6" color="#83e4ff"/>
                  </div>
                  <div className="text-[17px] text-gray-600 font-[200]">
                    내가 쓴 댓글
                  </div>
                </Link>
              </li>
              <li key="like-post">
                <Link
                  href={`/board/1`}
                  className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <HandThumbUpIcon className="size-6" color="#ffadad"/>
                  </div>
                  <div className="text-[17px] text-gray-600 font-[200]">
                    좋아요 누른 글
                  </div>
                </Link>
              </li>
              <li key="hot-post">
                <Link
                  href={`/board/hot-post`}
                  className="w-full px-2 py-1 flex flex-row items-center gap-4 cursor-pointer"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <FireIcon className="size-6" color="#ff4d4d" />
                  </div>
                  <div className="text-[17px] text-gray-600 font-[200]">
                    HOT 게시판
                  </div>
                </Link>
              </li>
            </ul>
            <div className="flex-grow">
              <BoardList boardList={boardList} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
