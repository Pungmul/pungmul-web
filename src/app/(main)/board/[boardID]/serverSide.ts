import { cookies } from "next/headers";
import { BoardData } from "./PostList";

export async function loadPostList(boardId: number): Promise<BoardData | null> {

    try {

        const proxyUrl = `${process.env.BASE_URL}/api/boards/${boardId}`;

        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const proxyResponse = await fetch(proxyUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            cache: 'no-cache'
        });

        if (!proxyResponse.ok) throw Error('서버 불안정' + proxyResponse.status)

        const { response } = await proxyResponse.json();

        // console.log(response);

        return response

    } catch (error) {

        console.error('프록시 처리 중 에러:', error);
        if (error instanceof Error)
            throw Error(error.message);
        else alert('알수 없는 에러')
        return null;
    }
}