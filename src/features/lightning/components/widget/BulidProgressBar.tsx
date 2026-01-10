"use client";
import { useLightningBuildStore } from "@/features/lightning/contexts/LightningBuildStoreContext";
import { BUILD_STEPS } from "../../store";

// SelectTarget 단계까지만 포함
const PROGRESS_STEPS = BUILD_STEPS.slice(0, 4); // SelectType, SelectLocation, SelectTimeAndPersonnel, SelectTarget

export function BuildProgressBar() {
  const buildStep = useLightningBuildStore((state) => state.buildStep);

  // 현재 단계의 인덱스 계산
  const currentStepIndex = PROGRESS_STEPS.indexOf(buildStep);
  // 진행률 계산 (0% ~ 100%)
  const progress = currentStepIndex === -1 
    ? 100 // SelectTarget 이후 단계는 100%
    : ((currentStepIndex + 1) / PROGRESS_STEPS.length) * 100;

  return (
    <div className="w-full h-1 bg-grey-200">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
