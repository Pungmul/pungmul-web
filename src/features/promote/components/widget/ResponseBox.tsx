"use client";
import { useState, useEffect, useRef } from "react";
import {
  PromotionDetail,
  QuestionDto,
  AnswerDto,
  ResponseDto,
} from "../../types";
import dayjs from "dayjs";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import React from "react";
import { QuestionTypeBadge } from "../element/QuestionTypeBadge";

interface ResponseBoxProps {
  form: ResponseDto;
  promotionDetail: PromotionDetail;
}

export const ResponseBox = React.memo(
  ({ form, promotionDetail }: ResponseBoxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    // 질문 순서대로 정렬
    const sortedQuestions = [...promotionDetail.questions].sort(
      (a, b) => a.orderNo - b.orderNo
    );

    useEffect(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    }, [form.answerList, promotionDetail.questions]);

    return (
      <div className="flex flex-col w-full px-[12px] py-[16px] border border-grey-200 rounded-[8px] transition-all duration-300 ease-in">
        <div
          className="flex flex-row gap-[4px] items-center cursor-pointer px-[12px]"
          onClick={handleToggle}
        >
          <div className="flex flex-col gap-[4px] flex-grow">
            <div className="font-normal text-grey-500 text-[13px] lg:text-[15px]">
              {form.submitterUsername} ({form.submitterNickname})
            </div>
            <div className="font-normal text-grey-500 text-[13px] lg:text-[15px]">
              {dayjs(form.submittedAt).format("YYYY.MM.DD (ddd) A H:mm")}
            </div>
          </div>
          <div className="flex items-center justify-center flex-shrink-0 px-[4px]">
            <ChevronDownIcon
              className={`w-[32px] h-[32px] text-grey-500 flex-shrink-0 transform-gpu transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isOpen ? `${contentHeight}px` : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div ref={contentRef} className="flex flex-col gap-[12px] pt-[12px]">
            {sortedQuestions.map((question: QuestionDto) => {
              const answer = form.answerList.find(
                (a: AnswerDto) => a.questionId === question.id
              );

              return (
                <div
                  key={question.id}
                  className="flex flex-col gap-[8px] p-[12px] bg-grey-50 rounded-[6px]"
                >
                  <div className="flex flex-col gap-[6px]">
                    <div className="flex flex-row items-center gap-[4px]">
                      <h3 className="font-semibold text-grey-700 text-[13px] lg:text-[14px]">
                        Q{question.orderNo}.
                      </h3>
                      <span className="font-medium text-grey-400 text-[13px] lg:text-[14px]">
                        {question.label}
                      </span>
                      {question.required && (
                        <span className="text-red-500 ml-0.5 text-[12px]">*</span>
                      )}
                    </div>
                    <QuestionTypeBadge questionType={question.questionType} />
                  </div>
                  <div className="text-grey-800 text-[12px] lg:text-[13px]">
                    {!answer ? (
                      <div className="text-grey-400 italic">(미응답)</div>
                    ) : question.questionType === "TEXT" ? (
                      <div>{answer.answerText || "(미응답)"}</div>
                    ) : (
                      <div>
                        {answer.selectedOptions &&
                        answer.selectedOptions.length > 0 ? (
                          answer.selectedOptions
                            .map((option) => option.label)
                            .join(", ")
                        ) : (
                          <span className="text-grey-400 italic">(미응답)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

ResponseBox.displayName = "ResponseBox";
