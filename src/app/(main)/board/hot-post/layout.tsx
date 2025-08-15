import { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";
import Suspense from "@/shared/components/SuspenseComponent";

import {
  fetchHotPostList,
  BriefBoardInfo,
  fetchBoardInformations,
  BoardListNav,
  BoardHeader,
} from "@/features/board";

export const metadata: Metadata = {
  title: "풍물 머시기 | 인기 게시글",
};

export default async function BoardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  const boardList: BriefBoardInfo[] = await fetchBoardInformations();

  queryClient.prefetchQuery({
    queryKey: ["boardList"],
    queryFn: () => fetchBoardInformations(),
  });

  queryClient.prefetchQuery({
    queryKey: ["board", "hot-post"],
    queryFn: () => fetchHotPostList(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex flex-col w-full h-full">
      <HydrationBoundary state={dehydratedState}>
        <div className="z-20 sticky top-0">
          <BoardHeader boardName={"인기 게시글"} />
        </div>
        <div className="flex flex-col w-full flex-grow relative">
          <div className="flex flex-row justify-center gap-[12px] w-full h-full">
            <BoardListNav boardList={boardList} currentBoardID={"hot-post"} />
            <Suspense>
              <div className="w-full max-w-[768px]">{children}</div>
            </Suspense>
          </div>
        </div>
        <div className="z-30" id="post-detail-section" />
      </HydrationBoundary>
    </div>
  );
}
