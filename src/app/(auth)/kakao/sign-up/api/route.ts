import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/kakao/register`;

    const form = await req.json();
    const cookieStore = await cookies();

    const signUpToken = cookieStore.get("signUpToken")?.value;

    const formData = new FormData();
    const accountData = new Blob(
      [
        JSON.stringify({
          ...form,
          signUpToken,
        }),
      ],
      { type: "application/json" }
    );
    formData.append("accountData", accountData);

    console.log(formData);
    const response = await fetch(proxyUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("에러:", errorText);
      throw Error("서버 불안정" + response.status);
    }

    // 프록시 응답 받기
    const proxyResponse = await response.json();
    console.log(proxyResponse);

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
      { message: "success to Sign Up! & Login!", token: accessToken },
      { headers }
    );

    // 클라이언트에 프록시 응답 반환
    return Response.json(proxyResponse, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
export const dynamic = "force-dynamic";
