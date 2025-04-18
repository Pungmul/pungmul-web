import { cookies } from "next/headers";

export async function POST(req:Request) {

    try {

        const url = new URL(req.url);
        const friendId:string = url.searchParams.get('friendId') ?? '';

        const proxyUrl = `${process.env.BASE_URL}/api/friends/request?receiverUsername=${friendId}`;

        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        console.log(proxyUrl)
        const response = await fetch(proxyUrl, {
            method:'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        if (!response.ok) throw Error('서버 불안정' + response.status)
        // 클라이언트에 프록시 응답 반환
        return Response.json('Success', { status: 200 });

    } catch (error) {
        console.error('프록시 처리 중 에러:', error);
        return new Response('프록시 처리 실패', { status: 500 });
    }
}
