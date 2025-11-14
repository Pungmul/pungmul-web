import { Metadata } from "next";
export const metadata: Metadata = {
  title: "친구 관리 | 풍덩",
  description: "친구 관리 페이지",
};

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
