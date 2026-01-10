"use client";

import { useCallback } from "react";

import dayjs from "dayjs";

import { NumberStepper,RangeSlider, TimeInput } from "@/shared/components";

import { useLightningCreateStore } from "../../../store/lightningCreateStore";

export const SelectTimeAndPersonnelStep = () => {
  const formData = useLightningCreateStore((state) => state.formData);
  const updateField = useLightningCreateStore((state) => state.updateField);

  const handleMinPersonnelChange = useCallback((min: number, max: number) => {
    updateField("minPersonnel", min);
    updateField("maxPersonnel", max);
  }, [updateField]);

  return (
    <div className="space-y-6">
      {/* 모집 마감 시간 */}
      <div className="space-y-3">
        <TimeInput
          label="모집 마감 시간"
          value={formData.recruitEndTime}
          onChange={(time) => updateField("recruitEndTime", time)}
          placeholder="모집 마감 시간을 선택해주세요"
          format="HH:mm"
          minTime={dayjs().format("HH:mm")}
        />
      </div>

      {/* 인원 선택 */}
      <div className="space-y-4">
        {/* Steppers */}
        <div className="flex gap-4 flex-col">
          <div className="flex-1">
            <NumberStepper
              label="최소 인원"
              value={formData.minPersonnel}
              min={4}
              max={100}
              onChange={(newValue) => {
                // 최대 인원보다 작아야 함
                if (newValue < formData.maxPersonnel) {
                  handleMinPersonnelChange(newValue, formData.maxPersonnel);
                }
              }}
              onDecrement={() => {
                const newValue = Math.max(2, formData.minPersonnel - 1);
                if (newValue < formData.maxPersonnel) {
                  handleMinPersonnelChange(newValue, formData.maxPersonnel);
                }
              }}
              onIncrement={() => {
                const newValue = Math.min(formData.maxPersonnel - 1, formData.minPersonnel + 1);
                handleMinPersonnelChange(newValue, formData.maxPersonnel);
              }}
              canDecrement={formData.minPersonnel > 2}
              canIncrement={formData.minPersonnel < formData.maxPersonnel - 1}
            />
          </div>
          
          <div className="flex-1">
            <NumberStepper
              label="최대 인원"
              value={formData.maxPersonnel}
              min={5}
              max={99}
              onChange={(newValue) => {
                // 최소 인원보다 커야 함
                if (newValue > formData.minPersonnel) {
                  handleMinPersonnelChange(formData.minPersonnel, newValue);
                }
              }}
              onDecrement={() => {
                const newValue = Math.max(formData.minPersonnel + 1, formData.maxPersonnel - 1);
                handleMinPersonnelChange(formData.minPersonnel, newValue);
              }}
              onIncrement={() => {
                const newValue = Math.min(100, formData.maxPersonnel + 1);
                handleMinPersonnelChange(formData.minPersonnel, newValue);
              }}
              canDecrement={formData.maxPersonnel > formData.minPersonnel + 1}
              canIncrement={formData.maxPersonnel < 100}
            />
          </div>
        </div>

        {/* Slider */}
        <RangeSlider
          minValue={formData.minPersonnel}
          maxValue={formData.maxPersonnel}
          min={4}
          max={99}
          step={1}
          onChange={handleMinPersonnelChange}
        />
      </div>
    </div>
  );
};
