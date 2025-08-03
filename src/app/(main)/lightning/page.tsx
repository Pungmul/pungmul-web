import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Suspense from "@/shared/components/SuspenseComponent";
import { LightningPage } from "@/features/lightning/components";
import { prefetchLightningData } from "@/features/lightning/api";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Lightning() {
  const queryClient = prefetchLightningData();
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense>
        <LightningPage />
      </Suspense>
    </HydrationBoundary>
  );
}
