import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { reissueToken } from "@/features/auth/api/serverApi";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/icons") ||
    req.nextUrl.pathname.startsWith("/logos") ||
    req.nextUrl.pathname.startsWith("/fonts") ||
    req.nextUrl.pathname.startsWith("/terms")
  ) {
    return NextResponse.next();
  }
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const kakaoSignUpToken = cookieStore.get("signUpToken")?.value;
  // 로그인 상태에서 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트

  if (req.nextUrl.pathname.startsWith("/api/auth/kakao/callback")) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/kakao/callback")) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/kakao/sign-up")) {
    if (kakaoSignUpToken) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (req.nextUrl.pathname === "/") {
    if (refreshToken) {
      // 로그인 되어있으면 /home
      return NextResponse.redirect(new URL("/home", req.url));
    } else {
      // 로그인 안되어있으면 /login
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (!refreshToken && !accessToken) {
    if (
      !req.nextUrl.pathname.startsWith("/login") &&
      !req.nextUrl.pathname.startsWith("/sign-up") &&
      !req.nextUrl.pathname.startsWith("/cookie") &&
      !req.nextUrl.pathname.startsWith("/kakao/login") &&
      !req.nextUrl.pathname.startsWith("/reset-password")
    ) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      return NextResponse.redirect(new URL("/login", req.url));
    } else {
      return NextResponse.next();
    }
  }

  if (refreshToken && !accessToken) {
    await reissueToken()
      .then((data) => {
        cookieStore.set("accessToken", data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: data.expiresIn,
        });
        cookieStore.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: data.refreshTokenExpiresIn,
        });
        return NextResponse.next();
      })
      .catch((error) => {
        console.error(error);
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        return NextResponse.redirect(new URL("/login", req.url));
      });
  }

  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/sign-up") ||
    req.nextUrl.pathname.startsWith("/api/auth/cookie") ||
    req.nextUrl.pathname.startsWith("/api/auth/kakao/login")
  ) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    if (refreshToken) {
      await reissueToken()
        .then((data) => {
          const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn,
            refreshTokenExpiresIn,
          } = data;

          cookieStore.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: expiresIn,
          });

          cookieStore.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: refreshTokenExpiresIn,
          });
          return NextResponse.redirect(new URL("/home", req.url));
        })
        .catch((error) => {
          console.error(error);
          cookieStore.delete("accessToken");
          cookieStore.delete("refreshToken");
          return NextResponse.next();
        });
    }

    return NextResponse.next();
  }

  // refreshToken이 없으면서 보호된 페이지 접근 시 로그인으로 리다이렉트
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - notification (notification API routes)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|notification).*)",
  ],
};
