import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/lightning/nearby`;

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) {
      const errorText = await proxyResponse.text();
      console.error("🔥 백엔드 에러 메시지:", errorText);
      throw Error("🔥서버 불안정" + proxyResponse.status);
    }

    const data = await proxyResponse.json();
    console.log(data);
    const { response } = await data;

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
