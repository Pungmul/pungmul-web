import { Suspense } from "react";
import LightningCreateCheckPageContent from "./checkPage";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function LightningCreateCheckPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <LightningCreateCheckPageContent />
    </Suspense>
  );
}
