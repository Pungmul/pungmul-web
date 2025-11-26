"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Conditional } from "@pThunder/shared/components/Conditional";
import checkMark from "@public/icons/checkMark.svg";
import { Question, QuestionType } from "../../types";
import { TextQuestionForm } from "./TextQuestionForm";
import { ChoiceQuestionForm } from "./ChoiceQuestionForm";
import { CheckboxQuestionForm } from "./CheckboxQuestionForm";
import { getQuestionTypeLabel } from "../../lib/questionType";
import { QuestionTypeIcon } from "../element/QuestionTypeIcon";

interface QuestionItemProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  isEditing: boolean;
  onFocus: () => void;
  onBlur: () => void;
  updateQuestion: (clientTempId: string, updates: Partial<Question>) => void;
  updateQuestionOption: (
    clientTempId: string,
    optionIndex: number,
    label: string
  ) => void;
  deleteQuestion: (clientTempId: string) => void;
  moveQuestion: (clientTempId: string, direction: "up" | "down") => void;
  addQuestionOption: (clientTempId: string) => void;
  removeQuestionOption: (clientTempId: string, optionIndex: number) => void;
}

export const QuestionItem = ({
  question,
  questionIndex,
  totalQuestions,
  isEditing,
  onFocus,
  onBlur,
  updateQuestion,
  updateQuestionOption,
  deleteQuestion,
  moveQuestion,
  addQuestionOption,
  removeQuestionOption,
}: QuestionItemProps) => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  const questionTypes = [
    {
      type: "TEXT" as QuestionType,
      label: getQuestionTypeLabel("TEXT"),
    },
    {
      type: "CHOICE" as QuestionType,
      label: getQuestionTypeLabel("CHOICE"),
    },
    {
      type: "CHECKBOX" as QuestionType,
      label: getQuestionTypeLabel("CHECKBOX"),
    },
  ];

  const getDefaultSettings = (type: QuestionType): string => {
    switch (type) {
      case "TEXT":
        return JSON.stringify({ maxLength: 100, placeholder: "" });
      case "CHOICE":
        return JSON.stringify({ shuffleOptions: false, allowOther: false });
      case "CHECKBOX":
        return JSON.stringify({ min: 1, max: 5 });
      default:
        return "{}";
    }
  };

  const handleTypeChange = (newType: QuestionType) => {
    if (newType === question.questionType) {
      setIsTypeDropdownOpen(false);
      return;
    }

    // 옵션 처리 로직
    let newOptions = question.options;
    
    if (newType === "TEXT") {
      // TEXT 타입으로 변경 시 옵션 제거
      newOptions = [];
    } else if (question.questionType === "TEXT") {
      // TEXT에서 CHOICE/CHECKBOX로 변경 시 기본 옵션 생성
      newOptions = [{ label: "", orderNo: 1 }];
    }
    // CHOICE <-> CHECKBOX 간 변환 시에는 기존 옵션 유지

    const updates: Partial<Question> = {
      questionType: newType,
      settingsJson: getDefaultSettings(newType),
      options: newOptions,
    };

    updateQuestion(question.clientTempId, updates);
    setIsTypeDropdownOpen(false);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeDropdownOpen(false);
      }
    };

    if (isTypeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {}; // 빈 함수 반환
  }, [isTypeDropdownOpen]);

  return (
    <div
      data-question-card
      className={`w-full border rounded-lg bg-background transition-all duration-200 overflow-hidden ${
        isEditing ? "border-blue-400 border-2 box-border" : "border-grey-300"
      }`}
    >
      {/* 편집 툴바 */}
      {isEditing && (
        <div className="flex items-center justify-between px-[12px] py-[8px] bg-grey-100 border-b border-grey-200">
          {/* 질문 타입 드롭다운 */}
          <div className="relative" ref={typeDropdownRef}>
            <div
              className="flex flex-row items-center p-[4px] text-grey-500 bg-grey-100 rounded hover:bg-grey-200 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsTypeDropdownOpen(!isTypeDropdownOpen);
              }}
            >
              <div>
                <QuestionTypeIcon type={question.questionType} className="size-4" />
              </div>
              <div className="text-[12px] font-medium px-[8px] py-[4px] text-grey-700">
                {getQuestionTypeLabel(question.questionType)}
              </div>
              <ChevronDownIcon
                className={`w-3 h-3 ${isTypeDropdownOpen ? "-scale-y-100" : ""}`}
              />
            </div>

            {/* 드롭다운 메뉴 */}
            {isTypeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-[160px] bg-background border border-grey-300 rounded-lg shadow-lg z-20">
                {questionTypes.map((typeOption) => (
                  <div
                    key={typeOption.type}
                    className={`flex items-center gap-[8px] px-[12px] py-[8px] cursor-pointer hover:bg-grey-100 first:rounded-t-lg last:rounded-b-lg ${
                      typeOption.type === question.questionType
                        ? "bg-grey-100 text-grey-800"
                        : "text-grey-600"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTypeChange(typeOption.type);
                    }}
                  >
                    <div
                      className={
                        typeOption.type === question.questionType
                          ? "text-blue-600 fill-blue-600"
                          : "text-grey-500 fill-grey-500"
                      }
                    >
                      <QuestionTypeIcon type={typeOption.type} className="size-4" />
                    </div>
                    <span className="text-[12px] font-medium">
                      {typeOption.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-row items-center gap-[4px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (questionIndex > 0) {
                  moveQuestion(question.clientTempId, "up");
                }
              }}
              disabled={questionIndex === 0}
              className={`p-[4px] rounded ${
                questionIndex === 0
                  ? "text-grey-100 cursor-not-allowed bg-grey-300"
                  : "text-grey-600 hover:bg-grey-100"
              }`}
              title={questionIndex === 0 ? "이동할 수 없습니다" : "위로 이동"}
            >
              <ArrowUpIcon className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (questionIndex < totalQuestions - 1) {
                  moveQuestion(question.clientTempId, "down");
                }
              }}
              disabled={questionIndex === totalQuestions - 1}
              className={`p-[4px] rounded ${
                questionIndex === totalQuestions - 1
                  ? "text-grey-100 cursor-not-allowed bg-grey-300"
                  : "text-grey-600 hover:bg-grey-100"
              }`}
              title={
                questionIndex === totalQuestions - 1
                  ? "이동할 수 없습니다"
                  : "아래로 이동"
              }
            >
              <ArrowDownIcon className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteQuestion(question.clientTempId);
              }}
              className="p-[4px] text-red-500 hover:bg-red-50 rounded"
              title="삭제"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="px-[12px] py-[12px]">
        <div className="flex flex-row items-center justify-start gap-[4px]">
          {!isEditing && (
            <>
              <span className="text-[12px] font-medium text-grey-500 bg-grey-100 px-[8px] py-[4px] rounded">
                {getQuestionTypeLabel(question.questionType)}
              </span>
              <div
                title="수정"
                data-question-item-edit-button
                className="ml-auto p-[4px] w-[28px] h-[28px] flex items-center justify-center cursor-pointer hover:bg-grey-100 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onFocus();
                }}
              >
                <PencilIcon className="size-fit text-grey-400 rounded" />
              </div>
            </>
          )}
        </div>

        <div className="my-[8px]">
          <Conditional
            value={question.questionType}
            cases={{
              TEXT: (
                <TextQuestionForm
                  question={question}
                  isEditing={isEditing}
                  updateQuestion={updateQuestion}
                />
              ),
              CHOICE: (
                <ChoiceQuestionForm
                  question={question}
                  isEditing={isEditing}
                  updateQuestion={updateQuestion}
                  updateQuestionOption={updateQuestionOption}
                  addQuestionOption={addQuestionOption}
                  removeQuestionOption={removeQuestionOption}
                />
              ),
              CHECKBOX: (
                <CheckboxQuestionForm
                  question={question}
                  isEditing={isEditing}
                  updateQuestion={updateQuestion}
                  updateQuestionOption={updateQuestionOption}
                  addQuestionOption={addQuestionOption}
                  removeQuestionOption={removeQuestionOption}
                />
              ),
            }}
          />
        </div>
      </div>
      {isEditing && (
        <div className="flex flex-row justify-between items-center gap-[8px] py-[8px] px-[12px] border-t border-grey-200">
          <label className="flex flex-row gap-2 items-center cursor-pointer px-[4px]">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) =>
                updateQuestion(question.clientTempId, {
                  required: e.target.checked,
                })
              }
              name="required"
              className="hidden peer"
            />
            <div className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center peer-checked:bg-primary">
              <Image src={checkMark} width={12} height={12} alt="" />
            </div>
            <div className="block w-5 h-5 bg-background border border-gray-300 peer-checked:hidden rounded-sm" />
            <div
              style={{ fontSize: 12 }}
              className="text-gray-300 peer-checked:text-grey-800"
            >
              필수 질문
            </div>
          </label>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBlur();
            }}
            className="flex items-center gap-[4px] px-[8px] py-[4px] text-[13px] text-white bg-blue-500 hover:bg-grey-700 rounded cursor-pointer"
            title="저장"
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
};
