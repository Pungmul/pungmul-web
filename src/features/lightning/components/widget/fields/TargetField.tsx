"use client";
import React from "react";
import { Controller } from "react-hook-form";
import { ChipButton } from "@/shared/components";

function TargetField() {
  return (
    <div className="flex flex-row justify-between px-[4px]">
      <label className="text-grey-500 text-[14px]">공개 범위</label>
      <Controller
        name="target"
        render={({ field }) => (
          <div className="flex gap-2">
            <ChipButton
              type="button"
              onClick={() => field.onChange("전체")}
              filled={field.value === "전체"}
            >
              전체
            </ChipButton>
            <ChipButton
              type="button"
              onClick={() => field.onChange("우리 학교만")}
              filled={field.value === "우리 학교만"}
            >
              우리 학교만
            </ChipButton>
          </div>
        )}
      />
    </div>
  );
}

const MemoizedTargetField = React.memo(TargetField);
MemoizedTargetField.displayName = 'TargetField';

export default MemoizedTargetField;
