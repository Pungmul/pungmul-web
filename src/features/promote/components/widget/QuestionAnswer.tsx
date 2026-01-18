"use client";
import { QuestionDto, Answer } from "../../types";
import { TextQuestionAnswer } from "./TextQuestionAnswer";
import { ChoiceQuestionAnswer } from "./ChoiceQuestionAnswer";
import { CheckboxQuestionAnswer } from "./CheckboxQuestionAnswer";

interface QuestionAnswerProps {
  question: QuestionDto;
  questionIndex: number;
  answer: Answer;
  onAnswerChange: (id: number, answer: Answer) => void;
  showError?: boolean;
}

export const QuestionAnswer = ({
  question,
  questionIndex,
  answer,
  onAnswerChange,
  showError = false,
}: QuestionAnswerProps) => {
  const renderAnswerInput = () => {
    switch (question.questionType) {
      case "TEXT":
        return (
          <TextQuestionAnswer
            question={question}
            answer={answer.answerText || ""}
            onAnswerChange={onAnswerChange}
            showError={showError}
          />
        );

      case "CHOICE":
        return (
          <ChoiceQuestionAnswer
            question={question}
            answer={answer.selectedOptionIds?.[0]}
            onAnswerChange={onAnswerChange}
            showError={showError}
          />
        );

      case "CHECKBOX":
        return (
          <CheckboxQuestionAnswer
            question={question}
            answer={answer.selectedOptionIds || []}
            onAnswerChange={onAnswerChange}
            showError={showError}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-[12px] w-full p-[16px] border border-grey-300 rounded-lg bg-background">
      <div className="text-[16px] font-medium text-grey-800">
        <span className="text-[14px] font-medium text-grey-600 mr-[8px]">
          Q{questionIndex + 1}.
        </span>
        <span>{question.label}</span>
        {question.required && <span className="text-red-500 ml-[4px]">*</span>}
      </div>

      {renderAnswerInput()}
    </div>
  );
};
