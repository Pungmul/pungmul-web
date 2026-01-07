"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Toast } from "@/shared";
import { updateLocation } from "@/features/location";

import { createLightningAPI } from "../api/createLightning";
import {
  useLightningBuildStore,
  useLightningBuildStoreApi,
} from "../contexts/LightningBuildStoreContext";
import { lightningQueryKeys } from "../queries";
import { buildLightningRequest } from "../services/buildLightningRequest";
import { BUILD_STEPS } from "../store/lightningBuildStore";
import { useLightningCreateStore } from "../store/lightningCreateStore";

export const useLightningBuild = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const buildStep = useLightningBuildStore((state) => state.buildStep);
  const store = useLightningBuildStoreApi();
  const setBuildStep = store.getState().setBuildStep;
  const { formData } = useLightningCreateStore();

  const { mutate: createLightningMutation, isPending } = useMutation({
    mutationFn: async () => {
      await updateLocation();
      const request = buildLightningRequest(formData);
      return createLightningAPI(request);
    },
    onSuccess: async () => {
      Toast.show({ message: "번개 생성에 성공했습니다.", type: "success" });
      await queryClient.invalidateQueries({
        queryKey: lightningQueryKeys.lightningList(),
      });
      await queryClient.invalidateQueries({
        queryKey: lightningQueryKeys.status(),
      });
      setBuildStep("Completed");
      router.replace("/lightning");
    },
    onError: () => {
      Toast.show({ message: "번개 생성에 실패했습니다.", type: "error" });
      // 실패 시 Summary로 돌아가기
      setBuildStep("Summary");
    },
  });

  // isPending 상태에 따라 Pending 단계로 자동 이동
  useEffect(() => {
    if (isPending && buildStep !== "Pending") {
      setBuildStep("Pending");
    }
  }, [isPending, buildStep]);

  const isSummaryVisible = useMemo(() => {
    return BUILD_STEPS.indexOf(buildStep) <= BUILD_STEPS.indexOf("Summary");
  }, [buildStep]);

  const handleNextClick = () => {
    if (buildStep === "Summary") {
      // Summary에서 다음 버튼 클릭 시 mutate 실행
      createLightningMutation();
    } else {
      // 다른 단계에서는 다음 단계로 이동
      setBuildStep(
        BUILD_STEPS[BUILD_STEPS.indexOf(buildStep) + 1] || "Completed"
      );
    }
  };

  return {
    buildStep,
    isSummaryVisible,
    isPending,
    handleNextClick,
  };
};
