import HotPostList from "@/features/board/board/components/HotPostList";
import PostDetailOverlay from "@/features/board/post/components/PostDetailOverlay";

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
      <PostDetailOverlay
        key="post-detail-overlay"
        boardName={"핫 게시글"}
      />
    </>
  );
}
