import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";
export async function GET() {

    try {

        const proxyUrl = `${process.env.BASE_URL}/api/boards/hot`;

        const proxyResponse = await fetchWithRefresh(proxyUrl);

        if (!proxyResponse.ok) throw Error('서버 불안정' + proxyResponse.status)

        const { response } = await proxyResponse.json();
        const { hotPosts } = response;
        return Response.json(hotPosts, { status: 200 })

    } catch (error) {

        console.error('프록시 처리 중 에러:', error);
        return new Response('프록시 처리 실패', { status: 500 });
    }
}