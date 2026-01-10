"use client";

import { useMemo } from "react";

import { BottomFixedButton } from "@/shared";

import {
  PendingStep,
  SelectionSummary,
  SelectLocationStep,
  SelectTargetStep,
  SelectTimeAndPersonnelStep,
  SelectTypeStep,
} from "@/features/lightning";
import { useLightningBuild } from "@/features/lightning";
import { useLightningBuildStore } from "@/features/lightning/contexts/LightningBuildStoreContext";

export default function LightningBuildPage() {
  const buildStep = useLightningBuildStore((state) => state.buildStep);
  const { isSummaryVisible, isPending, handleNextClick } = useLightningBuild();

  const StepContent = useMemo(() => {
    switch (buildStep) {
      case "SelectType":
        return <SelectTypeStep />;
      case "SelectLocation":
        return <SelectLocationStep />;
      case "SelectTimeAndPersonnel":
        return <SelectTimeAndPersonnelStep />;
      case "SelectTarget":
        return <SelectTargetStep />;
      case "Summary":
        return null; // Summary는 상단에 표시됨
      case "Pending":
        return <PendingStep />;
      default:
        return null;
    }
  }, [buildStep]);

  return (
    <div className="flex-1 flex flex-col">
      {isSummaryVisible && <SelectionSummary />}
      <main className="flex-1 flex flex-col px-6 py-4">{StepContent}</main>
      {!isPending && (
        <BottomFixedButton onClick={handleNextClick}>
          {buildStep === "Summary" ? "번개 생성" : "다음"}
        </BottomFixedButton>
      )}
    </div>
  );
}
