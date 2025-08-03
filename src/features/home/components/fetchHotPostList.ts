import { fetchWithRefresh } from "@/core";

export async function fetchHotPostList() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/boards/hot`;

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    const { hotPosts } = response;
    return hotPosts;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return [];
  }
} 