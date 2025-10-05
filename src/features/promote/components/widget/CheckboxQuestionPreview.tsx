"use client";
import { Question } from "../../types";

interface CheckboxQuestionPreviewProps {
  question: Question;
}

export const CheckboxQuestionPreview = ({ question }: CheckboxQuestionPreviewProps) => {
  return (
    <div className="space-y-[8px] px-[8px] flex flex-col gap-[4px]">
      {question.options.map((option, index) => (
        <div key={index} className="flex items-center gap-[8px]">
          <div className="w-4 h-4 border-2 border-grey-400 rounded"></div>
          <span className="text-[14px] text-grey-700">
            {option.label || `선택지 ${index + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
};
