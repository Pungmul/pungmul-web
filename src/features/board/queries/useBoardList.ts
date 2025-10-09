import { useQuery } from "@tanstack/react-query";
import { loadBoardInfoList } from "../api";

export const useBoardList = () => {
  return useQuery({
    queryKey: ["boardList"],
    queryFn: loadBoardInfoList,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};