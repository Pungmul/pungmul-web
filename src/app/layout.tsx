import "@pThunder/app/globals.css";
import { Viewport } from "next";
import localFont from "next/font/local";
import { PinchZoomPreventionScript } from "./PreventPinchZoom";
import ViewDetector from "./ViewDetector";

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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={nanumSquareNeo.variable}>
      <PinchZoomPreventionScript />
      <ViewDetector />
      <body>
        <div
          className="mx-auto h-dvh overflow-x-hidden"
          style={{ maxWidth: 560, minWidth: 386 }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
