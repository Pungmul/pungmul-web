import { HotPostList } from "@/features/board";
import { PostDetailOverlay } from "@/features/post";

export const dynamic = "force-dynamic";

export default async function HotPostPage() {
  return (
    <>
      <div
        key="hot-post-list-section"
        className="relative h-full flex flex-col"
      >
        <HotPostList />
      </div>
      <PostDetailOverlay key="post-detail-overlay" boardName={"핫 게시글"} />
    </>
  );
}
