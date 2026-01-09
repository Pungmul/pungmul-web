"use client";
import React from "react";
import { Controller } from "react-hook-form";
import { ChipButton } from "@/shared/components";

function LightningTypeField() {
  return (
    <div className="flex flex-row justify-between px-[4px]">
      <label className="text-grey-500 text-[14px]">모임 유형</label>
      <Controller
        name="lightningType"
        render={({ field }) => (
          <div className="flex gap-2">
            <ChipButton
              type="button"
              onClick={() => field.onChange("일반 모임")}
              filled={field.value === "일반 모임"}
            >
              일반 모임
            </ChipButton>
            <ChipButton
              type="button"
              onClick={() => field.onChange("풍물 모임")}
              filled={field.value === "풍물 모임"}
            >
              풍물 모임
            </ChipButton>
          </div>
        )}
      />
    </div>
  );
}

const MemoizedLightningTypeField = React.memo(LightningTypeField);
MemoizedLightningTypeField.displayName = 'LightningTypeField';

export default MemoizedLightningTypeField;
