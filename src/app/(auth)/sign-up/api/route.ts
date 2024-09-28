export async function POST(req: Request) {

  try {

    const proxyUrl = `${process.env.BASE_URL}/member/signup`;

    const formData = await req.formData();

    console.log(formData);

    const response = await fetch(proxyUrl, {
      method: 'POST',
      body: formData, // 원본 body를 그대로 전달
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
