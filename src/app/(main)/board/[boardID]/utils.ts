import { BoardData } from "./PostList";

export const loadMorePosts = async (
  id: number,
  page: number = 0,
  size: number = 10
) => {
  try {
    const response = await fetch(`/board/${id}/api?page=${page}&size=${size}`, {
      credentials: "include",
    });

    if (!response.ok) throw Error("비정상 동작");

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e);
  }
  return false;
};

export const loadPostDetail = async (postId: number) => {
  try {
    const proxyResponse = await fetch(`/board/post?postId=${postId}`, {
      credentials: "include",
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    console.log("response:", response);
    return response;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
};

export async function loadBoardInfo(
  boardId: number
): Promise<BoardData | null> {
  try {
    const proxyResponse = await fetch(`/board/${boardId}/info`, {
      credentials: "include",
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const response = await proxyResponse.json();

    console.log("response", response);

    return response;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    if (error instanceof Error) throw Error(error.message);
    else alert("알수 없는 에러");
    return null;
  }
}
