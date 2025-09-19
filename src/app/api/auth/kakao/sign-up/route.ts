import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const proxyUrl = `${process.env.BASE_URL}/api/member/kakao/register`;

    const form = await req.json();
    const cookieStore = await cookies();

    const signUpToken = cookieStore.get("signUpToken")?.value;

    const response = await fetch(proxyUrl, {
      method: "POST",
      body: JSON.stringify({ signUpToken, ...form }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("에러:", errorText);
      throw Error("서버 불안정" + response.status);
    }

    // 프록시 응답 받기
    const proxyResponse = await response.json();

    const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
      proxyResponse.response;

    if (!accessToken || !refreshToken) throw Error("Token is not valid!");

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: refreshTokenExpiresIn,
    });
    cookieStore.delete("signUpToken");

    // 클라이언트에 프록시 응답 반환
    return Response.json({
      message: "success to Sign Up! & Login!",
      token: accessToken,
    });

  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return new Response("프록시 처리 실패", { status: 500 });
  }
}
