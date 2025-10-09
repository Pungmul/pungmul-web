"use client";

import { useMyPostList } from "@/features/board/queries";
import { PostBoxWithCategory } from "@/features/board";
import type { PostWithCategoryName } from "@/features/post";

export default function MyPostList() {
  const { data: myPostList } = useMyPostList();

  return (
    <div className="h-full overflow-y-auto w-full">
      {myPostList?.list.length && myPostList?.list.length > 0 ? (
        myPostList?.list.map((post: PostWithCategoryName) => (
          <PostBoxWithCategory post={post} key={post.postId} />
        ))
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-gray-500 text-lg">
            내가 작성한 글이 없습니다.
          </div>
        </div>
      )}
    </div>
  );
}
