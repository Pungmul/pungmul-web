"use client";
import React from "react";
import { Controller } from "react-hook-form";
import { NumberStepper } from "@/shared/components";

function RecruitmentPeriodField() {
  return (
    <div className="flex flex-row justify-between items-center px-[4px]">
      <label className="text-grey-500 text-[14px]">모집 기간</label>
      <Controller
        name="recruitmentPeriod"
        render={({ field }) => (
          <NumberStepper
            value={field.value}
            setValue={field.onChange}
            min={1}
            max={60}
            step={1}
            validation={{
              min: 1,
              max: 60,
            }}
            inputComponent={
              <div className="w-[64px] text-center">
                {field.value} 분 후
              </div>
            }
          />
        )}
      />
    </div>
  );
}

export default React.memo(RecruitmentPeriodField);
