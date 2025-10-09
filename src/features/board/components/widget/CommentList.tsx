"use client";

import ObserveTrigger from "@/shared/components/ObserveTrigger";
import { PostBoxSkelleton } from "@/features/post";
import type { MyComment } from "@/features/comment";
import { CommentedPostBox } from "@/features/comment";

interface MyCommentListProps {
  comments: MyComment[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export default function CommentList({
  comments,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: MyCommentListProps) {
  return (
    <div className="h-full overflow-y-auto w-full">
      {comments.length > 0 ? (
        <>
          {comments.map((comment: MyComment) => (
            <CommentedPostBox comment={comment} key={comment.id} />
          ))}
          {isFetchingNextPage && <PostBoxSkelleton length={3} />}
          <ObserveTrigger
            trigger={() => {
              fetchNextPage();
              console.log("fetchNextPage");
            }}
            unmountCondition={!hasNextPage}
            triggerCondition={{
              rootMargin: "0px 0px 60px 0px",
            }}
          />
        </>
      ) : (
        <DefaultListEmptyComponent />
      )}
    </div>
  );
}

function DefaultListEmptyComponent(): React.ReactNode {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-gray-500 text-lg">아직 작성한 댓글이 없습니다.</div>
    </div>
  );
}
