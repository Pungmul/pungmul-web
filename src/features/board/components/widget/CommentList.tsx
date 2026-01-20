"use client";

import ObserveTrigger from "@/shared/components/ObserveTrigger";
import { ListEmptyView } from "@/shared/components";
import { PostBoxSkelleton } from "@/features/post";
import type { MyComment } from "@/features/comment";
import { CommentedPostBox } from "@/features/comment";

interface CommentListProps {
  comments: MyComment[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  ListEmptyComponent?: React.ReactNode;
}

const defaultCommentListEmpty = (
  <ListEmptyView message="아직 작성한 댓글이 없어요." />
);

export default function CommentList({
  comments,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  ListEmptyComponent = defaultCommentListEmpty,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col">
        {ListEmptyComponent}
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto w-full">
      {comments.map((comment: MyComment) => (
        <CommentedPostBox comment={comment} key={comment.id} />
      ))}
      {isFetchingNextPage && <PostBoxSkelleton length={3} />}
      <ObserveTrigger
        trigger={() => {
          fetchNextPage();
        }}
        unmountCondition={!hasNextPage}
        triggerCondition={{
          rootMargin: "0px 0px 60px 0px",
        }}
      />
    </div>
  );
}
