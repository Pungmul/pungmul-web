import { cookies } from "next/headers";

export async function POST(req: Request) {

    try {
        const url = new URL(req.url);
        const boardId = url.searchParams.get('boardId');


        const { title, text, anonymity, imgFiles } = await req.json();
        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const userForm = new FormData();

        if (imgFiles) {
            userForm.append('files', imgFiles);
        }

        const postBlob = new Blob([JSON.stringify({ title, text, anonymity })], {
            type: 'application/json'
        });

        userForm.append('postData', postBlob);

        userForm.append('categoryId', boardId!.toString());
        const proxyUrl = `${process.env.BASE_URL}/api/posts?categoryId=${boardId}`;

        console.log(proxyUrl, userForm)
        const proxyResponse = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
            , body: userForm
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