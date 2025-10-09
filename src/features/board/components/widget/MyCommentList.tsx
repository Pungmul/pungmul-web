"use client";

import { useMyCommentList } from "../../queries";
import { useMemo } from "react";
import CommentList from "./CommentList";

export default function MyCommentList() {
  const {
    data: myCommentList,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMyCommentList();

  const comments = useMemo(
    () => myCommentList?.pages.flatMap((page) => page.list) || [],
    [myCommentList]
  );

  return (
    <ul className="h-full overflow-y-auto w-full list-none">
      <CommentList
        comments={comments}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </ul>
  );
}
