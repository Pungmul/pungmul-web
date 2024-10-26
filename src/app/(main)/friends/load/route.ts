import { cookies } from "next/headers";

export async function GET() {

    try {

        const proxyUrl = `${process.env.BASE_URL}/api/friends`;

        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const response = await fetch(proxyUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        if (!response.ok) throw Error('서버 불안정' + response.status)

        // 프록시 응답 받기
        const proxyResponse = await response.json();
        console.log(proxyResponse.response)
        // 클라이언트에 프록시 응답 반환
        return Response.json(proxyResponse.response, { status: 200 });

    } catch (error) {
        console.error('프록시 처리 중 에러:', error);
        return new Response('프록시 처리 실패', { status: 500 });
    }
}
