import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { prefetchMyPageInfo } from "@pThunder/features/my-page/api/api";
import MyPageClient from "./MyPageClient";
import Suspense from "@/shared/components/SuspenseComponent";

// 서버 사이드 렌더링 완전 비활성화
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function MyPagePage() {
  const queryClient = prefetchMyPageInfo();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <MyPageClient />
      </Suspense>
    </HydrationBoundary>
  );
}
