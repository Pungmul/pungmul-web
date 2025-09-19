import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId: chatRoomUUID } = await params;

    const proxyUrl = `${process.env.BASE_URL}/api/chat/invite/${chatRoomUUID}`;

    const body = await req.json();

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    return Response.json({ status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
//
