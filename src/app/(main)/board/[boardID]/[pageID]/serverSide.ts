import { cookies } from "next/headers";

export const loadPost = async (postId: number) => {
     try {
    
            const proxyUrl = `${process.env.BASE_URL}/api/posts/${postId}`;
            
            const cookieStore = cookies();
            const accessToken = cookieStore.get('accessToken')?.value;
    
            const proxyResponse = await fetch(proxyUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            if (!proxyResponse.ok) throw Error('서버 불안정' + proxyResponse.status)
    
            const { response } = await proxyResponse.json();
            
            return response
    
        } catch (error) {
    
            console.error('프록시 처리 중 에러:', error);
            return new Response('프록시 처리 실패', { status: 500 });
        }
    }