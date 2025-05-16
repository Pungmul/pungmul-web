import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId: chatRoomUUID } = params;
    
    const proxyUrl = `${process.env.BASE_URL}/api/chat/message/${chatRoomUUID}`;
    const body = await req.json();
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    console.log(proxyUrl);
    const proxyResponse = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const data = await proxyResponse.json();
    const { response } = await data;
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
//
