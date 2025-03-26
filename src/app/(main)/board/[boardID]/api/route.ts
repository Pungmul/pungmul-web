import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: { boardID: string } }) {

    try {
        const url = new URL(req.url);
        const { boardID } = params;

        const page = url.searchParams.get('page')
        const size = url.searchParams.get('size')

        const proxyUrl = new URL(`${process.env.BASE_URL}/api/boards/${boardID}`);

        if (page)
            proxyUrl.searchParams.set('page', page)
        
        if (size)
            proxyUrl.searchParams.set('size', size)

        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const proxyResponse = await fetch(proxyUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!proxyResponse.ok) throw Error('서버 불안정' + proxyResponse.status)

        const { response } = await proxyResponse.json();

        return Response.json(response, { status: 200 })

    } catch (error) {

        console.error('프록시 처리 중 에러:', error);
        return new Response('프록시 처리 실패', { status: 500 });
    }
}