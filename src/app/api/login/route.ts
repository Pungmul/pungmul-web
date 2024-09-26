export async function POST(req: Request) {

    const { loginId, password }: { loginId: string, password: string } = await req.json();

    if (!loginId || !password)
        return new Response
            (`Error: wrongData:${!loginId && 'longId'} ${!password && 'password'} ${!loginId && !password ? 'are' : 'is'} not exist `,
                { status: 500 });

    try {
        const proxyUrl = `${process.env.BASE_URL}/member/login`;

        console.log({ loginId, password });

        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ loginId, password }),
        });

        if (!response.ok) throw Error('서버 불안정' + response.status)

        // 프록시 응답 받기
        const proxyResponse = await response.json();
        console.log(proxyResponse);
        // 클라이언트에 프록시 응답 반환

        return Response.json(proxyResponse, { status: 200 });
    } catch (error) {
        console.error('프록시 처리 중 에러:', error);
        return new Response
            (`프록시 처리 실패${error} `,
                { status: 500 });
    }
}
