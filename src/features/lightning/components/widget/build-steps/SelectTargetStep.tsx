"use client";

import { ChipButton } from "@/shared/components";

import { useLightningCreateStore } from "../../../store/lightningCreateStore";

export const SelectTargetStep = () => {
  const formData = useLightningCreateStore((state) => state.formData);
  const updateField = useLightningCreateStore((state) => state.updateField);

  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-4">
        <ChipButton
          type="button"
          onClick={() => updateField("target", "전체")}
          filled={formData.target === "전체"}
          className="flex-1 aspect-square rounded-2xl text-lg flex items-center justify-center"
        >
          전체
        </ChipButton>
        <ChipButton
          type="button"
          onClick={() => updateField("target", "우리 학교만")}
          filled={formData.target === "우리 학교만"}
          className="flex-1 aspect-square rounded-2xl text-lg flex items-center justify-center"
        >
          우리 학교만
        </ChipButton>
      </div>
    </div>
  );
};
