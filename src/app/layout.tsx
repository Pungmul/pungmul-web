import "@pThunder/app/globals.css";
import localFont from 'next/font/local';
import { initMocks } from "@pThunder/mocks/index";
import { MockProvider } from "./MockProviders";

if (process.env.NODE_ENV !== "production") {
  initMocks();
}
// 로컬 폰트 설정

const nanumSquareNeo = localFont({
  src: [
    {
      path: '/fonts/NanumSquareNeo-Variable.woff2',
      weight: '100 900', // 가변 폰트 범위 설정
    },
  ],
  variable: '--font-nanum-neo',
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={nanumSquareNeo.variable}>
      <body className="mx-auto h-svh overflow-hidden" style={{ maxWidth: 400, minWidth: 386 }}>
        <MockProvider>
          {children}
        </MockProvider>
      </body>
    </html>
  );
}