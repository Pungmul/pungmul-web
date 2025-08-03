import type { Metadata } from "next";
import { fetchBoardInformations, type BoardInfo } from "@/features/board";
import BoardMainPageContent from "@/features/board/board/components/BoardMainPageContent";
import { prefetchMyPageInfo } from "@pThunder/features/my-page";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "풍물 머시기 | 게시판",
  description: "풍물 머시기의 게시판 페이지 입니다.",
};

// ISR 설정: 15분마다 재생성
export const revalidate = 900; // 15분

export default async function BoardMainPage() {
  // 서버에서 게시판 정보 fetching
  const queryClient = prefetchMyPageInfo();
  const boardList: BoardInfo[] = await fetchBoardInformations();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BoardMainPageContent boardList={boardList} />
    </HydrationBoundary>
  );
}
