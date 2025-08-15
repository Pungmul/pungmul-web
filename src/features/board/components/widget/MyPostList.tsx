"use client";

import PostBox from "@pThunder/features/post/components/element/PostBox";
import { useMyPostList } from "@/features/board/api/myPost";
import PostBoxSkelleton from "@pThunder/features/post/components/element/PostBoxSkelleton";
import { Post } from "@pThunder/features/post/model/index";

export default function MyPostList() {
  const { data: myPostList, isLoading } = useMyPostList();

  return (
    <div className="h-full overflow-y-auto w-full">
      {myPostList?.list.length && myPostList?.list.length > 0 ? (
        myPostList?.list.map((post: Post) => (
          <PostBox post={post} key={post.postId} />
        ))
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-gray-500 text-lg">
            내가 작성한 글이 없습니다.
          </div>
        </div>
      )}
      {isLoading && <PostBoxSkelleton length={6} />}
    </div>
  );
}
