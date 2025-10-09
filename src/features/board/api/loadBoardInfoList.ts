import { BriefBoardInfo } from "../types";

// 게시판 정보를 가져오는 API 함수
export const loadBoardInfoList = async (): Promise<BriefBoardInfo[]> => {
  const proxyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/boards`;

  const proxyResponse = await fetch(proxyUrl, {
    // ISR을 위한 캐시 설정
    next: { revalidate: 900 },
  });

  if (!proxyResponse.ok) {
    throw new Error("서버 불안정" + (await proxyResponse.text()));
  }

  const { response } = await proxyResponse.json();

  return [
    ...response,
    { id: "promote", parentId: null, name: "홍보 게시판", description: "공연 모집 정보를 공유하는 게시판입니다" },
  ];
};
