import { fetchWithRefresh } from "@/core";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    console.log({roomId});

    const proxyUrl = `${process.env.BASE_URL}/api/chat/withdraw/${roomId}`;
    console.log(proxyUrl);

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
    });

    if (!proxyResponse.ok){
      const errorText = await proxyResponse.text();
      throw Error("서버 불안정" + proxyResponse.status + " " + errorText);}

    return Response.json({ status: 200 });
    
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
//
