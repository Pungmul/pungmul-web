"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "@/features/board/constants";
import { useMyPostList } from "@/features/board/queries";
import { PostWithCategoryNameList } from "@/features/post";
import { LinkChipButton, ListEmptyView } from "@/shared/components";

const MyPostListEmpty = () => (
  <ListEmptyView
    message="내 작성글이 없어요."
    action={
      <LinkChipButton href={ROUTES.FREE_BOARD} filled className="inline-flex items-center gap-1">
        자유 게시판으로
        <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />
      </LinkChipButton>
    }
  />
);

export default function MyPostList() {
  const { data: myPostList, isFetching, hasNextPage, onLoadMore } =
    useMyPostList();
  const posts = myPostList?.list ?? [];

  return (
    <div className="h-full overflow-y-auto w-full">
      <PostWithCategoryNameList
        posts={posts}
        isLoading={isFetching}
        hasNextPage={hasNextPage}
        onLoadMore={onLoadMore}
        ListEmptyComponent={<MyPostListEmpty />}
      />
    </div>
  );
}
