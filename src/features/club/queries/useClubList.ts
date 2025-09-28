"use client";
import { useQuery } from "@tanstack/react-query";
import { clubListApi } from "../api";

export const clubListQueryKeys = {
  all: ["clubList"] as const,
  list: () => [...clubListQueryKeys.all, "list"] as const,
};

export const useClubList = () => {
  return useQuery({
    queryKey: clubListQueryKeys.list(),
    queryFn: clubListApi,
    staleTime: 1000 * 60 * 60, // 1시간
    retry: 2,
  });
};

