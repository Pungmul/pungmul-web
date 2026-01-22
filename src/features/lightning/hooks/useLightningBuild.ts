"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Toast } from "@/shared";
import {
  useLightningBuildStore,
  useLightningBuildStoreApi,
} from "../contexts/LightningBuildStoreContext";
import {
  createLightningErrorToastConfig,
  createLightningSuccessToastConfig,
} from "../constant";
import { useCreateLightning } from "../queries";
import { useLightningCreateStore } from "../store/lightningCreateStore";
import { BUILD_STEPS } from "../store/lightningBuildStore";

export const useLightningBuild = () => {
  const router = useRouter();
  const buildStep = useLightningBuildStore((state) => state.buildStep);
  const store = useLightningBuildStoreApi();
  const setBuildStep = store.getState().setBuildStep;
  const { formData } = useLightningCreateStore();
  const { mutate: createLightningMutation, isPending } = useCreateLightning();

  const runCreateAndNavigate = () => {
    createLightningMutation(formData, {
      onSuccess: () => {
        Toast.show(createLightningSuccessToastConfig);
        setBuildStep("Completed");
        router.replace("/lightning");
      },
      onError: () => {
        Toast.show(createLightningErrorToastConfig);
        setBuildStep("Summary");
      },
    });
  };

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
      runCreateAndNavigate();
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
