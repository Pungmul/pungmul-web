"use client";

import { MyPostList } from "@/features/board";
import { PostDetailPage } from "@pThunder/features/post/components/widget/PostDetailPage";
import { PostingPage } from "@pThunder/features/post/components/widget/PostingPage";

export default function MyPostPage() {

  return (
    <>
      <section
        key="my-post-section"
        className="relative h-full flex flex-col"
      >
        <MyPostList />
      </section>
      <PostDetailPage boardName={"내가 작성한 글"} />
      <PostingPage />
    </>
  );
}
