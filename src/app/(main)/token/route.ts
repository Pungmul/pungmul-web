import { cookies } from "next/headers";

export async function POST(req: Request) {

    try {

        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) throw Error('invalid Token')

        const { fcmToken } = await req.json();

        if (!fcmToken) throw Error('fcmToken is not exsist')

        const proxyUrl = `${process.env.BASE_URL}/api/message/fcm/save-token`;

        console.log(proxyUrl,fcmToken)
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ fcmToken, deviceInfo: "iOS 15, iPhone 12" })
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
