import { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";

import {
  prefetchHotPostList,
  loadBoardInfoList,
  BoardListNav,
  BoardHeader,
} from "@/features/board";

export const metadata: Metadata = {
  title: "풍덩 | 인기 게시글",
};

export default async function BoardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["boardList"],
    queryFn: () => loadBoardInfoList(),
  });

  queryClient.prefetchQuery({
    queryKey: ["board", "hot-post"],
    queryFn: () => prefetchHotPostList(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex flex-col w-full h-full">
      <HydrationBoundary state={dehydratedState}>
        <BoardHeader boardID={"hot-post"} />
        <div className="flex flex-col w-full flex-grow relative">
          <div className="flex flex-row justify-center w-full h-full">
            <BoardListNav />
            <div className="w-full md:max-w-[768px] z-10">{children}</div>
          </div>
        </div>
      </HydrationBoundary>
    </div>
  );
}
