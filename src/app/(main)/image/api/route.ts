import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const requestUrl = url.searchParams.get("url");

    if (!requestUrl) {
      return new Response("URL이 제공되지 않았습니다.", { status: 400 });
    }

    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return new Response("인증 토큰이 없습니다.", { status: 401 });
    }
    const proxyResponse = await fetch(requestUrl, {
      cache: "no-cache",
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const contentType =
      proxyResponse.headers.get("Content-Type") ?? "application/octet-stream";

    const blobBuffer = await proxyResponse.arrayBuffer(); // blob → arrayBuffer로 변환

    return new Response(blobBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
