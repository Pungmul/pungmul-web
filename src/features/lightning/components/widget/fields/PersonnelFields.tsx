"use client";
import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { NumberStepper } from "@/shared/components";

function PersonnelFields() {
  return (
    <>
      <MinPersonnelStepper />
      <MaxPersonnelStepper />
    </>
  );
}

const MaxPersonnelStepper = () => {
  const watchMinPersonnel = useWatch({ name: "minPersonnel" });
  return (
    <Controller
      name="maxPersonnel"
      render={({ field }) => {
        const minValue = watchMinPersonnel + 1;
        const maxValue = 100;
        
        return (
          <NumberStepper
            label="최대 인원"
            value={field.value}
            min={minValue}
            max={maxValue}
            onChange={(newValue) => {
              // 최소 인원보다 커야 함
              if (newValue > watchMinPersonnel) {
                field.onChange(newValue);
              }
            }}
            onDecrement={() => {
              const newValue = Math.max(minValue, field.value - 1);
              field.onChange(newValue);
            }}
            onIncrement={() => {
              const newValue = Math.min(maxValue, field.value + 1);
              field.onChange(newValue);
            }}
            canDecrement={field.value > minValue}
            canIncrement={field.value < maxValue}
          />
        );
      }}
    />
  );
};

const MinPersonnelStepper = () => {
  const watchMaxPersonnel = useWatch({ name: "maxPersonnel" });
  return (
    <Controller
      name="minPersonnel"
      render={({ field }) => {
        const minValue = 2;
        const maxValue = watchMaxPersonnel - 1;
        
        return (
          <NumberStepper
            label="최소 인원"
            value={field.value}
            min={minValue}
            max={maxValue}
            onChange={(newValue) => {
              // 최대 인원보다 작아야 함
              if (newValue < watchMaxPersonnel) {
                field.onChange(newValue);
              }
            }}
            onDecrement={() => {
              const newValue = Math.max(minValue, field.value - 1);
              field.onChange(newValue);
            }}
            onIncrement={() => {
              const newValue = Math.min(maxValue, field.value + 1);
              field.onChange(newValue);
            }}
            canDecrement={field.value > minValue}
            canIncrement={field.value < maxValue}
          />
        );
      }}
    />
  );
};

const MemoizedPersonnelFields = React.memo(PersonnelFields);
MemoizedPersonnelFields.displayName = 'PersonnelFields';

export default MemoizedPersonnelFields;
