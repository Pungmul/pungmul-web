import { cookies } from "next/headers";

export async function GET(req: Request) {

    try {
        const url = new URL(req.url);
        const postID = url.searchParams.get('postID'); 

        const proxyUrl = `${process.env.BASE_URL}/api/posts/${postID}`;
        
        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const proxyResponse = await fetch(proxyUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            cache:'no-cache'
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