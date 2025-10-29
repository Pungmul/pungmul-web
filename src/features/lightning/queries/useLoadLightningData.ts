"use client";
import { useQuery } from "@tanstack/react-query";
import { loadLightningData } from "../api/loadLightningData";
import { lightningDataQueryKeys } from "./queryKeys";

export const useLoadLightningData = () => {
  return useQuery({
    queryKey: lightningDataQueryKeys.lightningData(),
    queryFn: loadLightningData,
  });
};
