import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getMyPageInfo } from "@pThunder/features/my-page";
import { getQueryClient } from "@pThunder/core";

export const metadata: Metadata = {
  title: "풍물 머시기 | 홈",
  description: "풍물 머시기의 메인화면 입니다.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["my-page-info"],
    queryFn: getMyPageInfo,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
