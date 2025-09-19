import { fetchWithRefresh } from "@pThunder/core";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/posts/user`;

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();

    return Response.json(response.userPosts);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
