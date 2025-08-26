import {
  BoardMainPageContent,
  type BriefBoardInfo,
} from "@/features/board";

export const metadata = {
  title: "풍물 머시기 | 게시판",
  description: "풍물 머시기의 게시판 페이지 입니다.",
};

// ISR 설정: 15분마다 재생성
export const revalidate = 900;

export default async function BoardMainPage() {
  // 서버에서 게시판 정보 fetching
  // const queryClient = prefetchMyPageInfo();
  const proxyUrl = `${process.env.BASE_URL}/api/boards`;
  const proxyResponse = await fetch(proxyUrl, {
    // ISR을 위한 캐시 설정
    next: { revalidate: 900 },
    // SSL 인증서 문제 해결을 위한 설정
  });

  const { response: boardList }: { response: BriefBoardInfo[] } =
    await proxyResponse.json();

  console.log(boardList);

  return <BoardMainPageContent boardList={boardList} />;
}
