"use client";
import React, { useCallback } from "react";

import { useController } from "react-hook-form";

import { ChipButton } from "@/shared/components";
import TimePicker from "@/shared/components/TimePicker";

function RecruitEndTimeField() {
  const {
    field: { value: recruitEndTime, onChange: setRecruitEndTime },
    formState: { errors: recruitEndTimeErrors },
  } = useController({ name: "recruitEndTime" });

  const handleTimeChange = useCallback(
    (time: string) => {
      setRecruitEndTime(time);
    },
    [setRecruitEndTime]
  );

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-[4px]">
        <label className="text-grey-500 text-[14px]">모집 마감 시간</label>
        <div className="flex flex-row items-center gap-2">
          {recruitEndTime && <span>{recruitEndTime}</span>}

          <TimePicker
            value={{
              startTime: recruitEndTime,
              endTime: recruitEndTime,
            }}
            onChange={(time) => handleTimeChange(time)}
            trigger={
              <ChipButton filled={!!recruitEndTime?.trim()}>
                시간 선택
              </ChipButton>
            }
          />
        </div>
      </div>
      {recruitEndTimeErrors && (
        <p className="text-red-500 text-sm mt-1">
          {recruitEndTimeErrors.root?.message}
        </p>
      )}
    </div>
  );
}

const MemoizedRecruitEndTimeField = React.memo(RecruitEndTimeField);
MemoizedRecruitEndTimeField.displayName = 'RecruitEndTimeField';

export default MemoizedRecruitEndTimeField;
