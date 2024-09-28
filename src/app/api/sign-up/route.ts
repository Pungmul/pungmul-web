export async function POST(req: Request) {

  try {

    const proxyUrl = `${process.env.BASE_URL}/member/signup`;

    const formData = await req.formData();

    console.log(formData, proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw Error('서버 불안정' + response.status)

    // 프록시 응답 받기
    const proxyResponse = await response.json();

    // 클라이언트에 프록시 응답 반환
    return new Response(JSON.stringify(proxyResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('프록시 처리 중 에러:', error);

    // 클라이언트에 에러 응답 반환
    return new Response(JSON.stringify({ error: '프록시 처리 실패', details: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
