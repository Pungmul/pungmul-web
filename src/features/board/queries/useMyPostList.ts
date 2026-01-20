import { useSuspenseQuery } from "@tanstack/react-query";
import { loadMyPostList } from "../api";

export const useMyPostList = () => {
  const query = useSuspenseQuery({
    queryKey: ["myPostList"],
    queryFn: loadMyPostList,
  });

  return {
    data: query.data,
    isFetching: query.isFetching,
    hasNextPage: false,
    onLoadMore: () => {},
  };
};
