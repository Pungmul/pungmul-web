"use client";
import { useRef } from "react";

import ObserveTrigger from "@/shared/components/ObserveTrigger";

import { PostBoxWithCategory } from "@/features/board/components/element/PostBoxWithCategory";

import { PostWithCategoryName } from '../../types';
import PostBoxSkelleton from "../element/PostBoxSkelleton";

interface PostWithCategoryNameListProps {
  posts: PostWithCategoryName[];
  isLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  ListEmptyComponent?: React.ReactNode;
}

export  default function PostWithCategoryNameList({
  posts,
  isLoading,
  hasNextPage,
  onLoadMore,
  ListEmptyComponent = <DefaultListEmptyComponent />,
}: PostWithCategoryNameListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isLoading && posts.length === 0) {
    return ListEmptyComponent;
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

function DefaultListEmptyComponent(): React.ReactNode {
  return (
    <div className="h-full flex-grow flex items-center justify-center py-12 px-4">
      <div className="text-grey-500 text-center">
        <p className="text-lg font-medium mb-2">아직 게시글이 없습니다</p>
      </div>
    </div>
  );
}
