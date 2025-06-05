// 게시판 정보를 가져오는 API 함수
export const fetchBoardInformations = async (): Promise<BoardInfo[]> => {
  
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/boards`;

    const proxyResponse = await fetch(proxyUrl, {});

    if (!proxyResponse.ok) {
      throw new Error("서버 불안정" + (await proxyResponse.text()));
    }

    const { response } = await proxyResponse.json();

    return response;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    throw error;
  }
};

export type BoardInfo = {
  id: number;
  parentId: number | null;
  name: string;
};
