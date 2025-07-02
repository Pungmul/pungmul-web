import { PostListResponse } from "@/shared/types/board/type";


export async function loadPostList(): Promise<PostListResponse> {
  try {
    const proxyUrl = `/board/hot-post/api`;

    const proxyResponse = await fetch(proxyUrl, {
      next: {
        revalidate: 10, // 이 부분만 추가
      },
      credentials: "include",
      cache: "no-cache",
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const data = await proxyResponse.json();
    const { hotPosts } = await data;

    return hotPosts;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    if (error instanceof Error) throw Error(error.message);
    else throw Error("알수 없는 에러");
  }
}
