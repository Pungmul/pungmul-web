import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// POST 요청으로 카카오 로그인 콜백 처리
export async function GET(req: Request) {
  try {
    // 카카오에서 받은 인증 코드 또는 토큰 처리
    const searchParams = new URLSearchParams(req.url);
    const accessToken = searchParams.get("token");
    const needRegister = searchParams.get("needRegister");
    const signUpToken = searchParams.get("signUpToken");
    const redirectURL = searchParams.get("redirectURL");

    const cookieStore = await cookies();

    if (accessToken) {
      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      });

      return Response.redirect(redirectURL ?? "/home", 302);
    }
    
    if(needRegister && signUpToken) {
      cookieStore.set("signUpToken", signUpToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      });

      return Response.redirect("/kakao/sign-up", 302);
    }

    return Response.redirect("/login", 302);
  } catch (error) {
    console.error("카카오 로그인 처리 중 에러:", error);
    return new Response(`카카오 로그인 실패: ${error}`, { status: 500 });
  }
}
