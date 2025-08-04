import { BriefBoardInfo } from "../model";

// 게시판 정보를 가져오는 API 함수
export const fetchBoardInformations = async (): Promise<BriefBoardInfo[]> => {
    const proxyUrl = `${process.env.BASE_URL}/api/boards`;
  
    const proxyResponse = await fetch(proxyUrl, {
      // ISR을 위한 캐시 설정
      next: { revalidate: 900 }
    });
  
    if (!proxyResponse.ok) {
      throw new Error("서버 불안정" + (await proxyResponse.text()));
    }
  
    const { response } = await proxyResponse.json();
  
    return response;
  };
  