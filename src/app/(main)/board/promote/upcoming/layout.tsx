import { getQueryClient } from "@pThunder/core";
import { BoardHeader } from "@pThunder/features/board";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { loadUpcomingPerformanceList } from "../../../../../features/promote/api";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "풍덩 | 관람 예정 공연",
  description: "관람 예정된 공연 목록 입니다.",
};

export const dynamic = "force-dynamic";

export default async function UpcomingPerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["upcomingPerformanceList"],
    queryFn: loadUpcomingPerformanceList,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex flex-col w-full h-full">
      <HydrationBoundary state={dehydratedState}>
        <BoardHeader boardID={"upcoming-performance"} />
        <div className="flex flex-col w-full flex-grow relative items-center">
          <div className="w-full max-w-[768px]">{children}</div>
        </div>
      </HydrationBoundary>
    </div>
  );
}
