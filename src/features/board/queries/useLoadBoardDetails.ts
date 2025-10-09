import { useQuery } from "@tanstack/react-query";
import { loadBoardDetails } from "../api";

export const useLoadBoardDetails = (boardId: number) => {
  return useQuery({
    queryKey: ["boardInfo", boardId],
    queryFn: () => loadBoardDetails(boardId),
    staleTime: 1000 * 60 * 5, // 5분간 신선한 데이터로 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
