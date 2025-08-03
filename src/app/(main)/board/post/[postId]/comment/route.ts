import { fetchWithRefresh } from "@/core";
export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ postId: string }> }) {

    try {
        const { postId } = await params;
        const postID = postId;

        const { content, parentId } = await req.json();

        const proxyUrl = parentId ? `${process.env.BASE_URL}/api/comments/${parentId}?postId=${postID}` : `${process.env.BASE_URL}/api/comments?postId=${postID}`;

        console.log(proxyUrl, !parentId ? JSON.stringify({ content }) : JSON.stringify({ content, parentId }))
        const proxyResponse = await fetchWithRefresh(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
            , body: !parentId ? JSON.stringify({ content }) : JSON.stringify({ content, parentId })
        });

        if (!proxyResponse.ok) throw Error('서버 불안정' + proxyResponse.status)

        const { response } = await proxyResponse.json();
        console.log(response)
        return Response.json(response, { status: 200 })

    } catch (error) {

        console.error('프록시 처리 중 에러:', error);
        return new Response('프록시 처리 실패', { status: 500 });
    }
}