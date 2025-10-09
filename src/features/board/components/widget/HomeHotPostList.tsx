"use client";

import PostBox from "@pThunder/features/post/components/element/PostBox";
import Link from "next/link";
import { useHotPostList } from "@/features/board/queries/useHotPostList";

export default function HomeHotPostList() {
  const { data: hotPosts } = useHotPostList();

  return (
    <div
      className="overflow-hidden rounded-[4px] shadow-up-sm min-h-[560px]"
    >
      {hotPosts && hotPosts.list.length > 0 ? (
        <ul className="flex flex-col list-none">
          {hotPosts.list.map((post) => (
            <PostBox key={"main-hot-post-" + post.postId} post={post} />
          ))}
        </ul>
      ) : (
        <div
          className="flex flex-col items-center justify-center h-[560px] gap-3"
        >
          <div className="text-grey-600 font-semibold text-[18px] md:text-[21px]">
            지금 뜨는 인기글이 없습니다.
          </div>
          <Link
            className="flex flex-row items-center gap-[2px] cursor-pointer"
            href="/board/main"
          >
            <div className="text-grey-400">새로운 글 작성하기</div>
          </Link>
        </div>
      )}
    </div>
  );
}
