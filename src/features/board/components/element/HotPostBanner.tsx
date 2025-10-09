"use client";

import { FireIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface HotPost {
  postId: number;
  title: string;
}

interface HotPostBannerProps {
  hotPost: HotPost | null;
}

export default function HotPostBanner({ hotPost }: HotPostBannerProps) {
  const content = (
    <div className="bg-red-50 flex flex-row w-full px-[12px] py-[8px] rounded-full items-center gap-2 overflow-hidden">
      <FireIcon
        className="w-[24px] h-[24px]"
        style={{
          color: hotPost ? "#FF4C4C" : "#C6C8CC",
        }}
      />
      <div
        className={
          "text-md font-medium line-clamp-1 text-ellipsis " +
          (hotPost ? "text-grey-700" : "text-grey-400")
        }
      >
        {hotPost?.title || "핫한 게시글이 없습니다."}
      </div>
    </div>
  );

  return (
    <div className="w-full px-[16px] h-[64px] flex items-center gap-2 flex-row bg-[#F9F8FF] md:bg-transparent">
      {hotPost ? (
        <Link href={`/board/d/${hotPost.postId}`}>
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}
