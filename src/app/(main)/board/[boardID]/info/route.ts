import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ boardID: string }> }
) {
  try {
    const { boardID } = await params;
    const boardId = parseInt(boardID);
    if (isNaN(boardId)) {
      return Response.json("잘못된 요청입니다", { status: 400 });
    }
    const proxyUrl = `${process.env.BASE_URL}/api/boards/${boardId}`;


    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();

    return Response.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    if (error instanceof Error) {
      return Response.json(error.message, {
        status: 500,
      });
    } else {
      return Response.json("알 수 없는 에러발생", {
        status: 500,
      });
    }
  }
}
