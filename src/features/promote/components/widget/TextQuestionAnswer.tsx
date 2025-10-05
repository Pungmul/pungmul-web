"use client";
import { useState } from "react";
import { Input } from "@pThunder/shared";
import { QuestionDto, Answer } from "../../types";

interface TextQuestionAnswerProps {
  question: QuestionDto;
  answer: string | undefined;
  onAnswerChange: (id: number, answer: Answer) => void;
  showError?: boolean;
}

export const TextQuestionAnswer = ({
  question,
  answer,
  onAnswerChange,
  showError = false,
}: TextQuestionAnswerProps) => {
  const [textAnswer, setTextAnswer] = useState<string>(answer || "");

  const handleTextChange = (value: string) => {
    setTextAnswer(value);
    onAnswerChange(question.id, {answerText: value});
  };

  const settings = question.settingsJson
    ? JSON.parse(question.settingsJson)
    : {};
  const maxLength = settings.maxLength || 100;
  const placeholder = settings.placeholder || "답변을 입력해주세요.";

  const isAnswerValid = () => {
    if (!question.required) return true;
    return textAnswer.trim().length > 0;
  };

  return (
    <div className="space-y-[8px] py-[8px]">
      <Input
        label=""
        name={`question-${question.id}`}
        type="text"
        placeholder={placeholder}
        value={textAnswer}
        onChange={(e) => handleTextChange(e.target.value)}
        maxLength={maxLength}
        className="w-full"
      />
      
      {showError && !isAnswerValid() && (
        <div className="text-[12px] text-red-500">
          이 질문은 필수 응답 항목입니다.
        </div>
      )}
    </div>
  );
};
