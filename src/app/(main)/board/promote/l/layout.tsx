import { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/core";
import {
  loadBoardDetails,
  BoardListNav,
  BoardHeader,
  loadBoardInfoList,
} from "@/features/board";

export const metadata: Metadata = {
  title: "풍덩 | 홍보 게시판",
};

export const dynamic = "force-static";

export default async function BoardPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    boardID: string;
  }>;
}) {
  const { boardID } = await params;
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["boardList"],
    queryFn: () => loadBoardInfoList(),
  });

  queryClient.prefetchQuery({
    queryKey: ["board", boardID],
    queryFn: () => loadBoardDetails(Number(boardID)),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="relative flex flex-col flex-grow">
        <BoardHeader boardID={"promote"} />
        <div className="flex flex-col w-full flex-grow relative">
          <div className="flex flex-row justify-center w-full h-full">
            <BoardListNav />
            <div className="w-full md:max-w-[768px] z-10">{children}</div>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
