"use client";

import { useHotPostList } from "@/features/board/queries";
import { PostWithCategoryNameList } from "@pThunder/features/post/components";
import { ListEmptyView } from "@/shared/components";

export default function HotPostList() {
  const { data: hotPostList, isLoading } = useHotPostList();

  return (
    <PostWithCategoryNameList
      posts={hotPostList.list}
      isLoading={isLoading}
      hasNextPage={false}
      onLoadMore={() => {}}
      ListEmptyComponent={
        <ListEmptyView message="아직 뜨는 인기글이 없어요." />
      }
    />
  );
}
