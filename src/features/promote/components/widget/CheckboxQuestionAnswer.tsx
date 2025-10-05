"use client";
import { useState } from "react";
import { QuestionDto, Answer } from "../../types";

interface CheckboxQuestionAnswerProps {
  question: QuestionDto;
  answer: number[] | undefined;
  onAnswerChange: (id: number, answer: Answer) => void;
  showError?: boolean;
}

export const CheckboxQuestionAnswer = ({
  question,
  answer,
  onAnswerChange,
  showError = false,
}: CheckboxQuestionAnswerProps) => {
  const [checkboxAnswers, setCheckboxAnswers] = useState<number[]>(
    answer || []
  );

  const handleCheckboxChange = (optionId: number, checked: boolean) => {
    let newAnswers: number[];
    if (checked) {
      newAnswers = [...checkboxAnswers, optionId];
    } else {
      newAnswers = checkboxAnswers.filter((item) => item !== optionId);
    }
    setCheckboxAnswers(newAnswers);
    onAnswerChange(question.id, {selectedOptionIds: [...newAnswers]});
  };

  const settings = question.settingsJson
    ? JSON.parse(question.settingsJson)
    : {};
  const min = settings.min || 1;
  const max = settings.max || question.options.length;

  const isAnswerValid = () => {
    if (!question.required) return true;
    return checkboxAnswers.length >= min;
  };

  return (
    <div className="space-y-[8px]">
      <div className="space-y-[8px] flex flex-col gap-[4px] py-[8px]">

        {question.options.map((option, index) => {
          const isDisabled = !checkboxAnswers.includes(option.id) && checkboxAnswers.length >= max;
          const isChecked = checkboxAnswers.includes(option.id);
          
          return (
            <label
              key={index}
              className={`flex items-center gap-[8px] cursor-pointer group ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  value={option.label}
                  checked={isChecked}
                  onChange={(e) =>
                    handleCheckboxChange(option.id, e.target.checked)
                  }
                  className="sr-only peer"
                  disabled={isDisabled}
                />
                <div className={`w-4 h-4 border-2 rounded transition-colors ${
                  isChecked 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-grey-400 group-hover:border-blue-400'
                }`}>
                  {isChecked && (
                    <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <span className={`text-[14px] ${isChecked ? 'text-black font-semibold' : 'text-grey-700'}`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      
      {showError && !isAnswerValid() && (
        <div className="text-[12px] text-red-500">
          이 질문은 필수 응답 항목입니다.
        </div>
      )}
    </div>
  );
};
