import { fetchWithRefresh } from "@pThunder/core";

export async function PATCH(req: Request) {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member`;
    const formData = await req.formData();

    const response = await fetchWithRefresh(proxyUrl, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("에러:", errorText);
      throw Error("서버 불안정" + response.status);
    }

    const proxyResponse = await response.json();
    
    return Response.json({ ...proxyResponse.response }, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
