import { fetchWithRefresh } from "@pThunder/core";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const page = url.searchParams.get("page");

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/comments/user`);

    proxyUrl.searchParams.set("page", page ?? "0");

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();

    return Response.json(response.comments);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
