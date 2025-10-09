"use client";

import { useHotPostList } from "@/features/board/queries";
import { PostWithCategoryNameList } from "@pThunder/features/post/components";

export default function HotPostList() {
  const { data: hotPostList, isLoading } = useHotPostList();

  return (
    <PostWithCategoryNameList
      posts={hotPostList.list}
      isLoading={isLoading}
      hasNextPage={false}
      onLoadMore={() => {}}
      ListEmptyComponent={<DefaultListEmptyComponent/>}
    />
  );
}

function DefaultListEmptyComponent(){
  return (
    <div className="h-full flex-grow flex items-center justify-center py-12 px-4">
      <div className="text-grey-500 text-center">
        <p className="text-lg font-medium mb-2">아직 뜨는 인기글이 없습니다</p>
      </div>
    </div>
  );
}
