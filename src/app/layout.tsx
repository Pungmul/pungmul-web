import { Viewport } from "next";
import localFont from "next/font/local";
import { PinchZoomPreventionScript } from "./PreventPinchZoom";
import ViewDetector from "./ViewDetector";
import "@/app/globals.css";
import { AlertModal } from "@/shared/components/ui/AlertModal";

const nanumSquareNeo = localFont({
  src: [
    {
      path: "../../public/fonts/NanumSquareNeo-Variable.woff2",
      weight: "100 900", // 가변 폰트 범위 설정
    },
  ],
  variable: "--font-nanum-neo",
});

export const viewport: Viewport = {
  userScalable: false,
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={nanumSquareNeo.variable}>
      <PinchZoomPreventionScript />
      <ViewDetector />
      <AlertModal />
      <body>
        {/* children은 페이지 컴포넌트 */}
        {/* 페이지 컴포넌트가 서버 컴포넌트라도 오류 없이 렌더링 됨 */}
        <div className="relative w-[100dvw] h-[100dvh] overflow-x-hidden z-0 max-w-[100dvw]">
          {children}
        </div>
      </body>
    </html>
  );
}
