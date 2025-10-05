"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Input } from "@pThunder/shared";
import { Question } from "../../types";

interface CheckboxQuestionFormProps {
  question: Question;
  isEditing: boolean;
  updateQuestion: (clientTempId: string, updates: Partial<Question>) => void;
  updateQuestionOption: (
    clientTempId: string,
    optionIndex: number,
    label: string
  ) => void;
  addQuestionOption: (clientTempId: string) => void;
  removeQuestionOption: (clientTempId: string, optionIndex: number) => void;
}

export const CheckboxQuestionForm = ({
  question,
  isEditing,
  updateQuestion,
  updateQuestionOption,
  addQuestionOption,
  removeQuestionOption,
}: CheckboxQuestionFormProps) => {
  if (isEditing) {
    return (
      <div className="space-y-[12px]">
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
        <div className="space-y-[8px]">
          <div className="flex items-center justify-between">
            <label className="text-[14px] font-medium text-grey-700">
              선택지
            </label>
            <button
              onClick={() => addQuestionOption(question.clientTempId)}
              className="text-[12px] text-blue-500 hover:text-blue-700"
            >
              + 선택지 추가
            </button>
          </div>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-end gap-[8px]">
              <Input
                label={`선택지 ${index + 1}`}
                placeholder={`선택지 ${index + 1}를 입력해주세요`}
                className="flex-1"
                type="text"
                value={option.label}
                onChange={(e) =>
                  updateQuestionOption(
                    question.clientTempId,
                    index,
                    e.target.value
                  )
                }
              />
              {question.options.length > 1 && (
                <button
                  onClick={() =>
                    removeQuestionOption(question.clientTempId, index)
                  }
                  className="px-2 py-3 text-red-500 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="size-[24px]" strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[8px] gap-[12px] flex flex-col">
      <div className="text-[16px] font-medium text-grey-800 px-[4px]">
        <span>{question.label || "질문을 입력해주세요."}</span>
        {question.required && <span className="text-red-500 ml-[4px]">*</span>}
      </div>
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
    </div>
  );
};
