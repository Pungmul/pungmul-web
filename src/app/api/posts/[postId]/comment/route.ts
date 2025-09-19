import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {

    const { postId } = await params;
    
    if (!postId) {
      return new Response("postId가 없습니다.", { status: 400 });
    }

    const { content, parentId } = await req.json();

    const proxyUrl = parentId
      ? `${process.env.BASE_URL}/api/comments/${parentId}?postId=${postId}`
      : `${process.env.BASE_URL}/api/comments?postId=${postId}`;

    
    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: !parentId
        ? JSON.stringify({ content })
        : JSON.stringify({ content, parentId }),
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
