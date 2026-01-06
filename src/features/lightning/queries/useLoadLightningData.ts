"use client";
import { useQuery } from "@tanstack/react-query";
import { loadLightningData } from "../api/loadLightningData";
import { lightningQueryKeys } from "./queryKeys";

export const useLoadLightningData = () => {
  return useQuery({
    queryKey: lightningQueryKeys.data(),
    queryFn: loadLightningData,
  });
};
