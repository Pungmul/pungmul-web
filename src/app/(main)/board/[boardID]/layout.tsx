import { getQueryClient } from "@pThunder/core";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { fetchBoardInfoAPI } from "@/features/board/api";
import BoardListNav from "@/features/board/board/components/BoardListNav";
import BoardHeader from "@/features/board/board/components/BoardHeader";
import { BoardInfo, fetchBoardInformations } from "@pThunder/features";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardID: string }>;
}) {
  const { boardID } = await params;
  const boardList: BoardInfo[] = await fetchBoardInformations();
  const boardName =
    boardList.find((board) => board.id === Number(boardID))?.name ||
    "알 수 없는 게시판";
  return {
    title: `풍물 머시기 | ${boardName}`,
  };
}

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
  const boardList: BoardInfo[] = await fetchBoardInformations();

  queryClient.prefetchQuery({
    queryKey: ["board", boardID],
    queryFn: () => fetchBoardInfoAPI(Number(boardID)),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="relative w-full flex flex-col flex-grow overflow-y-auto max-w-[100dvw]">
        <BoardHeader
          boardName={
            boardList.find((board) => board.id === Number(boardID))?.name ||
            "알 수 없는 게시판"
          }
        />
        <div className="flex flex-col w-full flex-grow relative">
          <div className="flex flex-row justify-center gap-[12px] w-full h-full">
            <BoardListNav
              boardList={boardList}
              currentBoardID={Number(boardID)}
            />
            <div className="w-full md:max-w-[768px] z-10">{children}</div>
          </div>
        </div>
       
      </div>
    </HydrationBoundary>
  );
}
