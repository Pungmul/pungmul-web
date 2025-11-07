import { Header } from "@pThunder/shared";
import { prefetchNotReadMessageList } from "@pThunder/features/home";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SuspenseComponent as Suspense } from "@/shared";
import { NotificationList } from "@/features/notification";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "풍덩 | 알림",
  description: "알림",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function NotificationPage() {
  const queryClient = prefetchNotReadMessageList();

  return (
    <div className="flex flex-col h-full">
      <Header title="알림" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense clientOnly>
          <NotificationList/>
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
