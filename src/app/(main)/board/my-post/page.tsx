import { MyPostList } from "@/features/board";
import { PostBoxSkelleton } from "@pThunder/features/post";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function MyPostPage() {
  return (
    <section key="my-post-section" className="relative h-full flex flex-col">
      <Suspense fallback={<PostBoxSkelleton length={8} />}>
        <MyPostList />
      </Suspense>
    </section>
  );
}
