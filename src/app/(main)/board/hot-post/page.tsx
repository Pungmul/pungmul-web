import { HotPostList } from "@/features/board";
import { Suspense } from "react";
import { PostBoxSkelleton } from "@pThunder/features/post";

export const dynamic = "force-dynamic";

export default async function HotPostPage() {
  return (
    <div
      key="hot-post-list-section"
      className="relative flex flex-col w-full bg-background min-h-full"
    >
      <Suspense fallback={<PostBoxSkelleton length={8} />}>
        <HotPostList />
      </Suspense>
    </div>
  );
}
