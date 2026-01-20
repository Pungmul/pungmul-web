"use client";
import { useRef } from "react";

import ObserveTrigger from "@/shared/components/ObserveTrigger";
import { ListEmptyView } from "@/shared/components";

import { PostBoxWithCategory } from "@/features/board/components/element/PostBoxWithCategory";

import { PostWithCategoryName } from "../../types";
import PostBoxSkelleton from "../element/PostBoxSkelleton";

interface PostWithCategoryNameListProps {
  posts: PostWithCategoryName[];
  isLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  ListEmptyComponent?: React.ReactNode;
}

const defaultListEmpty = (
  <ListEmptyView message="아직 게시글이 없습니다" />
);

export default function PostWithCategoryNameList({
  posts,
  isLoading,
  hasNextPage,
  onLoadMore,
  ListEmptyComponent = defaultListEmpty,
}: PostWithCategoryNameListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isLoading && posts.length === 0) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col">
        {ListEmptyComponent}
      </div>
    );
  }
  return (
    <div ref={containerRef} className="flex flex-col w-full max-w-full">
      <ul className="flex flex-col list-none">
        {posts.map((post) => (
          <PostBoxWithCategory post={post} key={post.postId} />
        ))}
        {isLoading && <PostBoxSkelleton length={3} />}
        <li>
          <ObserveTrigger
            trigger={onLoadMore}
            unmountCondition={!hasNextPage}
            triggerCondition={{
              rootMargin: "0px 0px 60px 0px",
            }}
          />
        </li>
      </ul>
    </div>
  );
}
