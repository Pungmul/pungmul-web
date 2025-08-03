"use client";

import PostBox from "../../post/components/PostBox";
import PostBoxSkelleton from "../../post/components/PostBoxSkelleton";
import { useHotPostList } from "../../api/hotPost";
import { Post } from "@pThunder/shared";


export default function HotPostList() {
  const { data: hotPostList, isLoading } = useHotPostList();

  return (
    <div className="h-full overflow-y-auto">
      {hotPostList?.list.length>0 ?
      hotPostList?.list.map((post: Post) => (
        <PostBox post={post} key={post.postId} />
      )):
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-gray-500 text-lg">인기 게시글이 없습니다.</div>
      </div>
      }
      {isLoading && <PostBoxSkelleton length={6} />}
    </div>
  );
}
