import { fetchWithRefresh } from "@/core";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const proxyResponse = await fetchWithRefresh(`${process.env.BASE_URL}/api/performances`, {
      method: "POST",
    });
    if (!proxyResponse.ok) {
      const errorText = await proxyResponse.text();
      console.log("서버 오류:", errorText);
      throw Error("서버 불안정" + proxyResponse.status);
    }

    const { response } = await proxyResponse.json();
    return Response.json({ formId: response });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
