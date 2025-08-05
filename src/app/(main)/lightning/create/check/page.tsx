import { Suspense } from "react";
import { LightningCreateCheckForm } from "@/features/lightning";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function LightningCreateCheckPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
        <LightningCreateCheckForm />
    </Suspense>
  );
}
