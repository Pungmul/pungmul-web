"use client";
import { useState } from "react";
import { QuestionDto, QuestionOptionDto, Answer } from "../../types";

interface ChoiceQuestionAnswerProps {
  question: QuestionDto;
  answer: number | undefined;
  onAnswerChange: (id: number, answer: Answer) => void;
  showError?: boolean;
}

export const ChoiceQuestionAnswer = ({
  question,
  answer,
  onAnswerChange,
  showError = false,
}: ChoiceQuestionAnswerProps) => {
  const [choiceAnswer, setChoiceAnswer] = useState<number | undefined>(answer);

  const handleChoiceChange = (option: QuestionOptionDto) => {
    setChoiceAnswer(option.id);
    onAnswerChange(question.id, {
      selectedOptionIds: [option.id],
      answerText: null,
    });
  };

  const isAnswerValid = () => {
    if (!question.required) return true;
    return (
      choiceAnswer !== undefined &&
      question.options.some((option) => option.id === choiceAnswer)
    );
  };

  return (
    <section className="space-y-[8px]">
      <div className="space-y-[8px] flex flex-col gap-[4px] py-[8px]">
        {question.options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-[8px] cursor-pointer group"
          >
            <div className="relative">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.label}
                checked={choiceAnswer === option.id}
                onChange={() => handleChoiceChange(option)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 border-2 border-grey-400 rounded-full peer-checked:border-blue-600 peer-checked:bg-blue-50 group-hover:border-blue-400 transition-colors">
                {choiceAnswer === option.id && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                )}
              </div>
            </div>
            <span
              className={`text-[14px] ${choiceAnswer === option.id ? "text-black font-semibold" : "text-grey-700"}`}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {showError && !isAnswerValid() && (
        <div className="text-[12px] text-red-500">
          이 질문은 필수 응답 항목입니다.
        </div>
      )}
    </section>
  );
};
