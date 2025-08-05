import BottomTabs from "@pThunder/shared/components/layout/BottomTabs";
import {
  NotificationToast,
  NotificationContainer,
  FCMClient,
  WebSocketWorker,
} from "@/features/notification";
import "@/app/globals.css";
import { HeaderProgressBar, Toast } from "@/shared/components";
import { Suspense } from "react";
import { prefetchMyPageInfo } from "@pThunder/features/my-page";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ReactQueryProviders from "@/shared/lib/useReactQuery";

export const revalidate = 600;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = prefetchMyPageInfo();
  return (
    <ReactQueryProviders>
      <div id="main-contents" className="relative flex">
        <FCMClient />
        <WebSocketWorker />
        <NotificationContainer />
        <NotificationToast />
        <Toast />
        <Suspense fallback={null}>
          <HeaderProgressBar />
        </Suspense>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <div className="flex-grow flex flex-col-reverse md:flex-row z-0 h-dvh">
            <BottomTabs />
            {children}
          </div>
        </HydrationBoundary>
      </div>
    </ReactQueryProviders>
  );
}
