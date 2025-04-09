import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: { roomId: string } }) {
    try {

        const proxyUrl = `${process.env.BASE_URL}/api/chat/${params.roomId}`;

        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const proxyResponse = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (!proxyResponse.ok) throw Error('서버 불안정' + proxyResponse.status)

        const data = await proxyResponse.json();
        console.log(data)
        const { response } = await data;

        return Response.json(response, { status: 200 })

    } catch (error) {

        console.error('프록시 처리 중 에러:', error);
        return new Response('프록시 처리 실패', { status: 500 });

    }
}