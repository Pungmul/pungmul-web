import { getQueryClient } from "@pThunder/core";
import { loadBoardInfoList } from "../api";

export const fetchBoardList = async () => {
  const queryClient = getQueryClient();

  const boardList = await queryClient.fetchQuery({
    queryKey: ["boardList"],
    queryFn: loadBoardInfoList,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    retry: 2,
  });

  return boardList;
};
