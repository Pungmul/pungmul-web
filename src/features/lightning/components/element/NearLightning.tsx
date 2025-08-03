"use client";
import NearLightningContent, { NearLightningContentError, NearLightningContentFallback } from "../widget/NearLightningContent";
import Suspense from "@pThunder/shared/components/SuspenseComponent";
import { ErrorBoundary } from "react-error-boundary";

export default function NearLightning() {
  return (
    <section className="flex flex-col relative gap-[20px]">
      <h2 className="flex flex-row items-end px-[24px] text-[18px] font-bold">
        근처에서 생긴 번개
      </h2>
      <ErrorBoundary
        fallback={
          <NearLightningContentError />
        }
      >
        <Suspense
          fallback={<NearLightningContentFallback />}
        >
          <NearLightningContent />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
