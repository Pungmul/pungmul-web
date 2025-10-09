import { useSuspenseQuery } from "@tanstack/react-query";
import { loadHotPostList } from "../api";

export const useHotPostList = () => {
    return useSuspenseQuery({
      queryKey: ["hotPostList"],
      queryFn: loadHotPostList,
    });
  };
  