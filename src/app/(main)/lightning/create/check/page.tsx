import { Suspense } from "react";
import { LightningCreateCheckForm, LightningCreateProvider } from "@/features/lightning";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function LightningCreateCheckPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <LightningCreateProvider>
        <LightningCreateCheckForm />
      </LightningCreateProvider>
    </Suspense>
  );
}
