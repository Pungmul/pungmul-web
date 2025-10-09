import { useSuspenseQuery } from "@tanstack/react-query";
import { loadMyPostList } from "../api";

export const useMyPostList = () => {
  return useSuspenseQuery({
    queryKey: ["myPostList"],
    queryFn: loadMyPostList,
  });
};
