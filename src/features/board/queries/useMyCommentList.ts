import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { loadMyCommentList } from "../api";

export const useMyCommentList = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ["myCommentList"],
    queryFn: ({ pageParam = 0 }) => loadMyCommentList(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
