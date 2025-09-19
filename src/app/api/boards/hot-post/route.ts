import { fetchWithRefresh } from "@pThunder/core";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/boards/hot`;

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    const { hotPosts } = response;
    return Response.json(hotPosts, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}

// "hotPosts": {
//             "total": 0,
//             "list": [],
//             "pageNum": 1,
//             "pageSize": 0,
//             "size": 0,
//             "startRow": 0,
//             "endRow": 0,
//             "pages": 0,
//             "prePage": 0,
//             "nextPage": 0,
//             "isFirstPage": true,
//             "isLastPage": true,
//             "hasPreviousPage": false,
//             "hasNextPage": false,
//             "navigatePages": 8,
//             "navigatepageNums": [],
//             "navigateFirstPage": 0,
//             "navigateLastPage": 0
//         }
