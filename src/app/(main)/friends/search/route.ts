import { cookies } from "next/headers";

export async function GET(req: Request) {

    try {

        const url = new URL(req.url);
        const keyword = url.searchParams.get('keyword') ?? '';

        const proxyUrl = new URL(`${process.env.BASE_URL}/api/friends/request`);
        proxyUrl.searchParams.set('keyword', keyword)

        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const response = await fetch(proxyUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        if (!response.ok) throw Error('서버 불안정' + response.status)

        // 프록시 응답 받기
        const {response:data} = await response.json();
        // 클라이언트에 프록시 응답 반환
        console.log(data)
        return Response.json(data, { status: 200 });

    } catch (error) {
        console.error('프록시 처리 중 에러:', error);
        return new Response('프록시 처리 실패', { status: 500 });
    }
}
