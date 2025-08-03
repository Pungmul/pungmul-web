import { getQueryClient } from "@pThunder/core";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import BoardListNav from "@/features/board/board/components/BoardListNav";
import BoardHeader from "@/features/board/board/components/BoardHeader";
import { fetchHotPostList } from "@/features/board/api/hotPost";
import { BoardInfo, fetchBoardInformations } from "@pThunder/features/board";
import Suspense from "@pThunder/shared/components/SuspenseComponent";

export const metadata = {
  title: "풍물 머시기 | 인기 게시글",
};

export default async function BoardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  const boardList: BoardInfo[] = await fetchBoardInformations();

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
      </HydrationBoundary>
    </div>
  );
}
