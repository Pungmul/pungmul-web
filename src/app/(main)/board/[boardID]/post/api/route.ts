import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: { boardID: string } }
) {
  try {
    const boardId = params.boardID;

    const formData = await req.formData();
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const proxyUrl = `${process.env.BASE_URL}/api/posts?categoryId=${boardId}`;

    console.log(formData, proxyUrl);

    const proxyResponse = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    console.log(response);
    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { boardID: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    const boardId = params.boardID;
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

    const formData = await req.formData();
    if (!accessToken) {
      return new Response("accessToken이 없습니다.", { status: 401 });
    }
    if (!proxyUrl) {
      return new Response("프록시 URL이 없습니다.", { status: 500 });
    }

    console.log(formData, proxyUrl);
    const proxyResponse = await fetch(proxyUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
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
