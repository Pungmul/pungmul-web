import { cookies } from "next/headers";

export async function POST(req: Request) {

    try {
        const url = new URL(req.url);
        const boardId = url.searchParams.get('boardId');


        const formData = await req.formData();
        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const proxyUrl = `${process.env.BASE_URL}/api/posts?categoryId=${boardId}`;

        console.log(formData)
        
        const proxyResponse = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
            , body: formData
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