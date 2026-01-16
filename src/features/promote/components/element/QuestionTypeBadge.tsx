"use client";
import React from "react";

import { cn } from "@/shared";

import { getQuestionTypeLabel } from "../../lib/questionType";
import { QuestionType } from "../../types";
import { QuestionTypeIcon } from "./QuestionTypeIcon";

interface QuestionTypeBadgeProps {
  questionType: QuestionType;
  className?: string;
}

export const QuestionTypeBadge = React.memo(function QuestionTypeBadge({
  questionType,
  className = "",
}: QuestionTypeBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-row items-center gap-[4px] px-[8px] py-[4px] bg-grey-100 border border-grey-200 rounded-full w-fit",
        className
      )}
    >
      <div className="text-blue-600 fill-blue-600">
        <QuestionTypeIcon type={questionType} />
      </div>
      <span className="text-[11px] font-medium text-grey-700">
        {getQuestionTypeLabel(questionType)}
      </span>
    </div>
  );
});

QuestionTypeBadge.displayName = "QuestionTypeBadge";
