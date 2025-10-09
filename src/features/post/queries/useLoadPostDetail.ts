import { useSuspenseQuery } from "@tanstack/react-query";
import { loadPostDetail } from "../api";
import { postQueryKeys } from "../constant";

export const useLoadPostDetail = (postId: number | null) => {
  return useSuspenseQuery({
    queryKey: postQueryKeys.detail(postId ?? null),
    queryFn: () => {
      if (!postId) {
        return null;
      }
      return loadPostDetail(postId);
    },
    staleTime: 1000 * 5,
    retry: 2,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

