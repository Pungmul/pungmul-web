"use client";

import PostBox from "@pThunder/features/post/components/element/PostBox";
import { useMyPostList } from "@/features/board/api/myPost";
import PostBoxSkelleton from "@pThunder/features/post/components/element/PostBoxSkelleton";
import DragScroll from "@/shared/components/DragScroll";
import { Post } from "@pThunder/features/post/model/index";

export default function MyPostList() {
  const { data, isLoading } = useMyPostList();

  return (
    <div className="flex flex-col overflow-y-auto">
      <DragScroll>
        {data?.list.map((post: Post) => (
          <PostBox post={post} key={post.postId+"-my-post"} />
        ))}
        {isLoading && <PostBoxSkelleton length={3} />}
      </DragScroll>
    </div>
  );
} 