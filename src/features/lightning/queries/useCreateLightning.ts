"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLocation } from "@/features/location";

import { createLightningAPI } from "../api/createLightning";
import { lightningQueryKeys } from "./queryKeys";
import { buildLightningRequest } from "../services/buildLightningRequest";
import type { LightningCreateFormData } from "../types";

/**
 * 번개 생성 Mutation Hook.
 * payload(formData)는 호출부에서 넘김. 성공 시 data/status만 refetch.
 * Toast·이동·스텝 등은 호출부 onSuccess/onError에서 처리.
 */
export const useCreateLightning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: LightningCreateFormData) => {
      await updateLocation();
      const request = buildLightningRequest(formData);
      return createLightningAPI(request);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: lightningQueryKeys.data() }),
        queryClient.refetchQueries({ queryKey: lightningQueryKeys.status() }),
      ]);
    },
  });
};
