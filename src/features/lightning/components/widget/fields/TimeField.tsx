"use client";
import React, { useCallback } from "react";
import { useController } from "react-hook-form";
import { ChipButton } from "@/shared/components";
import TimePicker from "@pThunder/shared/components/TimePicker";

function TimeField() {
  const {
    field: { value: startTime, onChange: setStartTime },
    formState: { errors: startTimeErrors },
  } = useController({ name: "startTime" });
  const {
    field: { value: endTime, onChange: setEndTime },
    formState: { errors: endTimeErrors },
  } = useController({ name: "endTime" });

  const handleTimeChange = useCallback(
    (startTime: string, endTime: string) => {
      setStartTime(startTime);
      setEndTime(endTime);
    },
    [setStartTime, setEndTime]
  );

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <label className="text-grey-500 text-[14px]">활동 시간</label>
        <div className="flex flex-row items-center gap-2">
          {startTime && endTime && (
            <span>
              {startTime} - {endTime}
            </span>
          )}

          <TimePicker
            value={{
              startTime: startTime,
              endTime: endTime,
            }}
            onChange={handleTimeChange}
            trigger={
              <ChipButton filled={!!startTime?.trim() && !!endTime?.trim()}>
                시간 선택
              </ChipButton>
            }
          />
        </div>
      </div>
      {startTimeErrors && (
        <p className="text-red-500 text-sm mt-1">
          {startTimeErrors.root?.message}
        </p>
      )}
      {endTimeErrors && (
        <p className="text-red-500 text-sm mt-1">
          {endTimeErrors.root?.message}
        </p>
      )}
    </div>
  );
}

const MemoizedTimeField = React.memo(TimeField);
MemoizedTimeField.displayName = 'TimeField';

export default MemoizedTimeField;
