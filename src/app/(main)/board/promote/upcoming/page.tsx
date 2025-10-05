import { UpcomingPerformanceList } from "@/features/promote";
import { PostBoxSkelleton } from "@pThunder/features/post";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function UpcomingPerformancePage() {
  return (
    <section key="upcoming-performance-list-section" className="relative h-full flex flex-col">
      <Suspense fallback={<PostBoxSkelleton length={8} />}>
        <UpcomingPerformanceList />
      </Suspense>
    </section>
  );
}
