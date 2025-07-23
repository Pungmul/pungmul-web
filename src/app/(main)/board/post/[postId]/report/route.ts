import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const proxyUrl = `${process.env.BASE_URL}/api/posts/${postId}/report`;

    console.log(proxyUrl);

    const body = await req.json();

    console.log(body);
    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!proxyResponse.ok) {
      const errorText = await proxyResponse.text();
      console.log(errorText);
      throw Error("서버 불안정" + proxyResponse.status + errorText);
    }

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
