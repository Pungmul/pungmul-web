import { fetchWithRefresh } from '@/core';
export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {

  try {

      const proxyUrl = `${process.env.BASE_URL}/api/member/inst`;


      const reqJson = await req.json();

      console.log(JSON.stringify(reqJson))

      const response = await fetchWithRefresh(proxyUrl, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqJson)
      });

      console.log(response)
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