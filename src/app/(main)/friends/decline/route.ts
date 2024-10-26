import { cookies } from "next/headers";

export async function POST(req:Request) {

    try {

        const url = new URL(req.url);
        const friendRequestId:number = Number(url.searchParams.get('friendRequestId'));

        const proxyUrl = `${process.env.BASE_URL}/api/friends/decline?friendRequestId=${friendRequestId}`;

        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

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
