import FCMClient from "@pThunder/features/notification/components/FCM";
import BottomTabs from "@pThunder/shared/components/layout/BottomTabs";
import NotificationToast from "@/features/notification/components/NotificationToast";
import NotificationContainer from "@pThunder/features/notification/components/NotificationContainer";
import "@/app/globals.css";
import { HeaderProgressBar, Toast } from "@/shared/components";
import { Suspense } from "react";
import { prefetchMyPageInfo } from "@/features/my-page/api/api";
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
