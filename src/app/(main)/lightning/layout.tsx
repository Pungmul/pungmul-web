import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "풍덩 | 번개",
  description: "풍덩의 번개 페이지 입니다.",
};

export default function LightningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
