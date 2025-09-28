export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { loginId, password }: { loginId: string; password: string } =
    await req.json();

  if (!loginId || !password)
    return new Response(
      `Error: wrongData:${!loginId && "longId"} ${!password && "password"} ${
        !loginId && !password ? "are" : "is"
      } not exist `,
      { status: 500 }
    );

  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/login`;

    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginId, password }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.log("에러 메시지:" + text);
      throw Error("서버 불안정" + response.status);
    }

    // 프록시 응답 받기
    const proxyResponse = await response.json();

    const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
      proxyResponse.response;

    if (!accessToken || !refreshToken) throw Error("Token is not valid!");

    const headers = new Headers();

    headers.append(
      "Set-Cookie",
      `accessToken=${accessToken}; Path=/; SameSite=Strict; HttpOnly; Max-Age=${expiresIn}`
    );
    headers.append(
      "Set-Cookie",
      `refreshToken=${refreshToken}; Path=/; SameSite=Strict; HttpOnly; Max-Age=${refreshTokenExpiresIn}`
    );
    // 클라이언트에 프록시 응답 반환
    return Response.json(
      { message: "success to Login!", token: accessToken },
      { headers }
    );
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return Response.json(
      {
        error,
      },
      { status: 500 }
    );
  }
}
