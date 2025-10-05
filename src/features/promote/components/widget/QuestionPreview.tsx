"use client";
import { Question } from "../../types";
import { TextQuestionPreview } from "./TextQuestionPreview";
import { ChoiceQuestionPreview } from "./ChoiceQuestionPreview";
import { CheckboxQuestionPreview } from "./CheckboxQuestionPreview";

interface QuestionPreviewProps {
  question: Question;
  questionIndex: number;
}

export const QuestionPreview = ({ question, questionIndex }: QuestionPreviewProps) => {
  const renderQuestionContent = () => {
    switch (question.questionType) {
      case "TEXT":
        return <TextQuestionPreview />;

      case "CHOICE":
        return <ChoiceQuestionPreview question={question} />;

      case "CHECKBOX":
        return <CheckboxQuestionPreview question={question} />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-[8px] gap-[12px] flex flex-col">
      <div className="text-[16px] font-medium text-grey-800 px-[4px]">
        <span className="text-[14px] font-medium text-grey-600 mr-[8px]">
          Q{questionIndex + 1}.
        </span>
        <span>{question.label || "질문을 입력해주세요."}</span>
        {question.required && <span className="text-red-500 ml-[4px]">*</span>}
      </div>
      {renderQuestionContent()}
    </div>
  );
};
