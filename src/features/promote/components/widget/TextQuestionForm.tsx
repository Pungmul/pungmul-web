"use client";
import { Input } from "@pThunder/shared";
import { Question } from "../../types";

interface TextQuestionFormProps {
  question: Question;
  isEditing: boolean;
  updateQuestion: (clientTempId: string, updates: Partial<Question>) => void;
}

export const TextQuestionForm = ({
  question,
  isEditing,
  updateQuestion,
}: TextQuestionFormProps) => {
  if (isEditing) {
    return (
      <Input
        label="질문"
        placeholder="질문을 입력해주세요."
        className="w-full"
        type="text"
        value={question.label}
        onChange={(e) =>
          updateQuestion(question.clientTempId, { label: e.target.value })
        }
      />
    );
  }

  return (
    <div className="space-y-[8px] flex flex-col gap-[12px]">
      <div className="text-[16px] font-medium text-grey-800 px-[4px]">
        <span>{question.label || "질문을 입력해주세요."}</span>
        {question.required && <span className="text-red-500 ml-[4px]">*</span>}
      </div>
      <div className="flex flex-col px-[8px]">
        <div className="w-full p-[8px] rounded-[5px] bg-grey-100 text-grey-400 font-light text-[14px]">
          답변 입력란
        </div>
      </div>
    </div>
  );
};
