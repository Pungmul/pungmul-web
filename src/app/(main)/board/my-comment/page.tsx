import MyCommentList from "@pThunder/features/board/components/widget/MyCommentList";
import { PostBoxSkelleton } from "@pThunder/features/post";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function MyCommentPage() {
  return (
    <section key="my-comment-section" className="relative h-full flex flex-col">
      <Suspense fallback={<PostBoxSkelleton length={8} />}>
        <MyCommentList />
      </Suspense>
    </section>
  );
}
