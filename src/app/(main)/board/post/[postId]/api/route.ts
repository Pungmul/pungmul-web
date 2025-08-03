import { fetchWithRefresh } from "@pThunder/core";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {

    try {
        const url = new URL(req.url);
        const postID = url.searchParams.get('postID'); 

        const proxyUrl = `${process.env.BASE_URL}/api/posts/${postID}`;
        

        const proxyResponse = await fetchWithRefresh(proxyUrl);

        if (!proxyResponse.ok) throw Error('서버 불안정' + proxyResponse.status)

        const { response } = await proxyResponse.json();
        console.log(response)
        
        return Response.json(response, { status: 200 })

    } catch (error) {

        console.error('프록시 처리 중 에러:', error);
        return new Response('프록시 처리 실패', { status: 500 });
    }
}