import BottomTabs from "@pThunder/shared/components/layout/BottomTabs";
import {
  NotificationToast,
  NotificationContainer,
  FCMClient,

} from "@/features/notification";
import "@/app/globals.css";
import { HeaderProgressBar, Toast } from "@/shared/components";
import { Suspense } from "react";
import ReactQueryProviders from "@/shared/lib/useReactQuery";

export const dynamic = "force-static";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <div className="flex-grow flex flex-col-reverse md:flex-row z-0 h-dvh">
            <BottomTabs />
            {children}
          </div>
      </div>
    </ReactQueryProviders>
  );
}
