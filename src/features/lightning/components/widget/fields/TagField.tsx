"use client";
import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import { ChipButton } from "@/shared/components";
import { LIGHTNING_TAGS } from "../../../constant";
import type { LightningCreateFormData } from "@pThunder/features/lightning/types/lightningCreate.schemas";

function TagField() {
  type Tag = LightningCreateFormData["tagList"][number];

  const handleTagToggle = useCallback(
    (tag: Tag, currentTags: Tag[], setValue: (value: Tag[]) => void) => {
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t: Tag) => t !== tag)
        : [...currentTags, tag];
      setValue(newTags);
    },
    []
  );

  return (
    <div className="flex flex-col gap-[8px] px-[4px]">
      <label className="text-grey-500 text-[14px]">태그</label>
      <Controller
        name="tagList"
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {LIGHTNING_TAGS.map((tag) => (
              <ChipButton
                key={tag}
                type="button"
                filled={field.value?.includes(tag)}
                onClick={() => {
                  handleTagToggle(tag, field.value, field.onChange);
                }}
              >
                {tag}
              </ChipButton>
            ))}
          </div>
        )}
      />
    </div>
  );
}

const MemoizedTagField = React.memo(TagField);
MemoizedTagField.displayName = 'TagField';

export default MemoizedTagField;
