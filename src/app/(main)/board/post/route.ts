import { fetchWithRefresh } from "@pThunder/core";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {


    const { searchParams } = new URL(req.url);

    const postId = searchParams.get("postId");
    if (!postId) {
      return new Response("postId가 없습니다.", { status: 400 });
    }
    const postIdNumber = parseInt(postId);
    if (isNaN(postIdNumber)) {
      return new Response("postId는 숫자여야 합니다.", { status: 400 });
    }
    const proxyUrl = `${process.env.BASE_URL}/api/posts/${postIdNumber}`;

    if (!proxyUrl) {
      return new Response("프록시 URL이 없습니다.", { status: 500 });
    }

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();

    return Response.json({ response }, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
