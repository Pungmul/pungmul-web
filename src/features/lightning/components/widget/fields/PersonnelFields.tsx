"use client";
import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { NumberStepper } from "@/shared/components";

function PersonnelFields() {
  return (
    <>
      <div className="flex flex-row justify-between px-[4px]">
        <label className="text-grey-500 text-[14px]">최소 인원</label>
        <MinPersonnelStepper />
      </div>

      <div className="flex flex-row justify-between items-center px-[4px]">
        <label className="text-grey-500 text-[14px]">최대 인원</label>
        <MaxPersonnelStepper />
      </div>
    </>
  );
}

const MaxPersonnelStepper = () => {
  const watchMinPersonnel = useWatch({name: "minPersonnel"});
  return (
    <Controller
      name="maxPersonnel"
      render={({ field }) => (
        <NumberStepper
          value={field.value}
          setValue={field.onChange}
          min={watchMinPersonnel + 1}
          max={100}
          validation={{
            min: watchMinPersonnel + 1,
            max: 100,
          }}
          inputComponent={
            <input
              className="w-[64px] text-center outline-none border-0 border-b-[1px] focus:border-b-grey-800 box-border border-b-grey-200"
              value={field.value}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < watchMinPersonnel + 1) {
                  field.onChange(watchMinPersonnel + 1);
                  return;
                }
                if (value > 100) {
                  field.onChange(100);
                  return;
                }
                field.onChange(value);
              }}
            />
          }
        />
      )}
    />
  );
};

const MinPersonnelStepper = () => {
  const watchMaxPersonnel = useWatch({name: "maxPersonnel"});
  return (
    <Controller
      name="minPersonnel"
      render={({ field }) => (
        <NumberStepper
          value={field.value}
          setValue={field.onChange}
          min={2}
          max={watchMaxPersonnel - 1}
          validation={{
            min: 2,
            max: watchMaxPersonnel - 1,
          }}
          inputComponent={
            <input
              className="w-[64px] text-center outline-none border-0 border-b-[1px] focus:border-b-grey-800 box-border border-b-grey-200"
              value={field.value}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 2) {
                  field.onChange(2);
                  return;
                }
                if (value > watchMaxPersonnel - 1) {
                  field.onChange(watchMaxPersonnel - 1);
                  return;
                }
                field.onChange(value);
              }}
            />
          }
        />
      )}
    />
  );
};

export default React.memo(PersonnelFields);
