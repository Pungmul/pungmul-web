import type { Metadata } from "next";
import { fetchBoardInformations, type BoardInfo } from "@/features/board";
import BoardMainPageContent from "@/features/board/board/components/BoardMainPageContent";

export const metadata: Metadata = {
  title: "풍물 머시기 | 게시판",
  description: "풍물 머시기의 게시판 페이지 입니다.",
};

// ISR 설정: 15분마다 재생성
export const dynamic = "force-dynamic";

export default async function BoardMainPage() {
  // 서버에서 게시판 정보 fetching
  // const queryClient = prefetchMyPageInfo();  
  const boardList: BoardInfo[] = await fetchBoardInformations();

  return (
    <BoardMainPageContent boardList={boardList} />
  );
}
