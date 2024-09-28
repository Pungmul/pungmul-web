import { cookies } from "next/headers";

export async function GET() {

    try {

        const proxyUrl = `${process.env.BASE_URL}/member`;
        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const response = await fetch(proxyUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) throw Error('서버 불안정' + response.status)

        // 프록시 응답 받기
        const proxyResponse = await response.json();
        console.log(proxyResponse.response)

        const { instrumentStatusDTOList } = proxyResponse.response;
        // 클라이언트에 프록시 응답 반환
        return Response.json(instrumentStatusDTOList, { status: 200 });

    } catch (error) {
        console.error('프록시 처리 중 에러:', error);
        return new Response('프록시 처리 실패', { status: 500 });
    }
}

export async function POST(req: Request) {

    try {

        const proxyUrl = `${process.env.BASE_URL}/member/inst`;
        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const reqJson = await req.json();

        console.log(JSON.stringify(reqJson), accessToken)

        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(reqJson)
        });

        if (!response.ok) throw Error('서버 불안정' + response.status)

        // 프록시 응답 받기
        const proxyResponse = await response.json();

        // 클라이언트에 프록시 응답 반환
        return Response.json(proxyResponse, { status: 200 });

    } catch (error) {
        console.error('프록시 처리 중 에러:', error);
        return new Response('프록시 처리 실패', { status: 500 });
    }
}
