import { HotPostList } from "@/features/board";
import { PostDetailPage } from "@pThunder/features/post/components/widget/PostDetailPage";

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
      <PostDetailPage
        boardName={"핫 게시글"}
      />
    </>
  );
}
