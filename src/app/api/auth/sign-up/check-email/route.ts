export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response("이메일이 필요합니다", { status: 400 });
    }

    const proxyUrl = new URL(`${process.env.BASE_URL}/api/member/signup/check`);
    proxyUrl.searchParams.set("username", email);

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("이메일 중복 체크 에러:", errorText);
      throw new Error("서버 오류");
    }
    
    const { response: { isRegistered } } = await response.json();
    
    // 중복되지 않으면 true, 중복되면 false 반환
    return Response.json({ isRegistered });
  } catch (error) {
    console.error("이메일 중복 체크 처리 중 에러:", error);
    return new Response("이메일 중복 체크 실패", { status: 500 });
  }
}
