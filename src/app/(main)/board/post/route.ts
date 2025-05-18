import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    console.log("프록시 처리 시작");
    console.log("req.url", req.url);
    const { searchParams } = new URL(req.url);
    console.log(searchParams);
    const postId = searchParams.get("postId");
    if (!postId) {
      return new Response("postId가 없습니다.", { status: 400 });
    }
    const postIdNumber = parseInt(postId);
    if (isNaN(postIdNumber)) {
      return new Response("postId는 숫자여야 합니다.", { status: 400 });
    }
    const proxyUrl = `${process.env.BASE_URL}/api/posts/${postIdNumber}`;
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return new Response("accessToken이 없습니다.", { status: 401 });
    }
    if (!proxyUrl) {
      return new Response("프록시 URL이 없습니다.", { status: 500 });
    }

    const proxyResponse = await fetch(proxyUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-cache",
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    console.log(response);
    return Response.json({ response }, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
