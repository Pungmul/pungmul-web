"use client";

import { ChipButton } from "@/shared/components";

import { useLightningCreateStore } from "../../../store/lightningCreateStore";

export const SelectTypeStep = () => {
  const formData = useLightningCreateStore((state) => state.formData);
  const updateField = useLightningCreateStore((state) => state.updateField);

  return (
    <div className="space-y-6">
      <div className="flex flex-row gap-4">
        <ChipButton
          type="button"
          onClick={() => updateField("lightningType", "일반 모임")}
          filled={formData.lightningType === "일반 모임"}
          className="flex-1 aspect-square rounded-2xl text-lg flex items-center justify-center"
        >
          일반 모임
        </ChipButton>
        <ChipButton
          type="button"
          onClick={() => updateField("lightningType", "풍물 모임")}
          filled={formData.lightningType === "풍물 모임"}
          className="flex-1 aspect-square rounded-2xl text-lg flex items-center justify-center"
        >
          풍물 모임
        </ChipButton>
      </div>
    </div>
  );
};
