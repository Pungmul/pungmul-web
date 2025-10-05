"use client";
import { useEffect, useState } from "react";
import { QuestionDto, Answer } from "../../types";
import { QuestionAnswer } from "./QuestionAnswer";
import { Spinner } from "@pThunder/shared";

interface PromotionSurveyPageProps {
  questions: QuestionDto[];
  onSubmit?: (answers: Record<string, Answer>) => void;
}

export const PromotionSurveyPage = ({
  questions,
  onSubmit,
}: PromotionSurveyPageProps) => {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ableToContinue, setAbleToContinue] = useState(false);

  const handleAnswerChange = (id: number, answer: Answer) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: answer,
    }));
  };

  useEffect(() => {
    setAbleToContinue(validateAnswers());
  }, [answers]);

  const validateAnswers = () => {
    for (const question of questions) {
      if (!question.required) continue;

      const answer = answers[question.id];

      switch (question.questionType) {
        case "TEXT":
          if (!answer?.answerText?.trim() || answer.answerText.trim().length === 0) return false;
          break;
        case "CHOICE":
          if (!answer || answer.selectedOptionIds?.length === 0) return false;
          break;
        case "CHECKBOX":
          const settings = question.settingsJson
            ? JSON.parse(question.settingsJson)
            : {};
          const min = settings.min || 1;
          if (
            !answer ||
            !Array.isArray(answer.selectedOptionIds) ||
            answer.selectedOptionIds?.length < min
          )
            return false;
          break;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setShowErrors(true);

    if (!validateAnswers()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 실제 API 호출
      if (onSubmit) {
        onSubmit(answers);
      }

      // 성공 처리
      alert("설문이 성공적으로 제출되었습니다!");
    } catch (error) {
      console.error("설문 제출 오류:", error);
      alert("설문 제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" p-[16px] space-y-[24px]">
      {/* 질문들 */}
      <div className="space-y-[16px]">
        {questions.map((question, index) => (
          <QuestionAnswer
            key={question.id}
            question={question}
            questionIndex={index}
            answer={
              answers[question.id] || {
                answerText: null,
                selectedOptionIds: [],
              }
            }
            onAnswerChange={handleAnswerChange}
            showError={showErrors}
          />
        ))}
      </div>

      {/* 제출 버튼 */}
      <div className="pt-[16px] ">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !ableToContinue}
          className={`w-full py-[12px] rounded-md flex justify-center items-center font-semibold ${
            isSubmitting || !ableToContinue
              ? "bg-grey-300 text-grey-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {!ableToContinue?
          `필수 응답 항목을 모두 입력해주세요. (${questions.filter((question) => question.required).length}개)`
          
          :isSubmitting ? (
            <>
              <Spinner />
              <span className="ml-[8px]">제출 중...</span>
            </>
          ) : (
            "설문 제출하기"
          )}
        </button>
      </div>
    </div>
  );
};
