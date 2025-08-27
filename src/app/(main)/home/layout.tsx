import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "풍물 머시기 | 홈",
  description: "풍물 머시기의 메인화면 입니다.",
};

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
