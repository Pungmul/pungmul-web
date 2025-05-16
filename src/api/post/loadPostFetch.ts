interface Post {
  postId: number; // 게시물 ID (Long 타입, TypeScript에서는 number로 사용)
  title: string; // 게시물 제목
  content: string; // 게시물 내용
  imageList: ImageObject[]; // 이미지 파일 목록 (이미지 경로의 리스트로 가정)
  author: any;
  isLiked: boolean;
  isWriter: boolean;
}

interface ImageObject {
  id: number; // 파일의 고유 ID
  originalFilename: string; // 원본 파일명
  convertedFileName: string; // 변환된 파일명 (S3 저장 경로 포함)
  fullFilePath: string; // 전체 파일 경로 (S3 URL)
  fileType: string; // 파일 타입 (예: image/jpeg)
  fileSize: number; // 파일 크기 (바이트 단위)
  createdAt: string; // 파일이 생성된 시간 (ISO 형식)
}

export const loadPostFetch = async ({
  postId,
}: {
  postId: number;
}): Promise<Post> => {
  try {
    const response = await fetch(`/board/post?postId=${postId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw Error("비정상 동작");

    const { response: data } = await response.json();

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("게시물 로드 실패");
  }
};
