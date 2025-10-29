import { Suspense } from "react";
import { LightningCreateCheckForm } from "@/features/lightning";
import { Spinner } from "@pThunder/shared";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function LightningCreateCheckPage() {
  return (
    <main className="w-full h-full md:max-w-[768px] md:w-full md:mx-auto">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-background">
            <Spinner size={40} />
          </div>
        }
      >
        <LightningCreateCheckForm />
      </Suspense>
    </main>
  );
}
