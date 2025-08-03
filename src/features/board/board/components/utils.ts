// 게시판 정보를 가져오는 API 함수
export const fetchBoardInformations = async (): Promise<BoardInfo[]> => {
  try {

    const proxyUrl = `${process.env.NEXT_PUBLIC_BASE_URL||"https://pungmul.site"}/api/boards`;

    const proxyResponse = await fetch(proxyUrl);

    if (!proxyResponse.ok) {
      console.warn("게시판 정보 로드 실패, 기본값 사용:", await proxyResponse.text());
      return getDefaultBoardInfo();
    }

    const { response } = await proxyResponse.json();

    return response;
  } catch (error) {
    console.warn("게시판 정보 로드 중 오류 발생, 기본값 사용:", error);
    return getDefaultBoardInfo();
  }
};

// 기본 게시판 정보 (빌드 시점이나 API 실패 시 사용)
const getDefaultBoardInfo = (): BoardInfo[] => {
  return [
    {
      id: 1,
      parentId: null,
      name: "공지사항",
      description: "공지사항 게시판입니다."
    },
    {
      id: 2,
      parentId: null,
      name: "자유게시판",
      description: "자유게시판 게시판입니다."
    },
    {
      id: 3,
      parentId: null,
      name: "질문과답변",
      description: "질문과답변 게시판입니다."   
    }
  ];
};

export type BoardInfo = {
  id: number;
  parentId: number | null;
  name: string;
  description: string;
};
