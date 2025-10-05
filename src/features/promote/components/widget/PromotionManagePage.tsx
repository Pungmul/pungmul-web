"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Header, Space, Spinner } from "@pThunder/shared";
import { PromotionDetail, QuestionDto, QuestionOptionDto } from "../../types";
import { PromotionProfile } from "./PromotionProfile";
import dayjs from "dayjs";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, useRef } from "react";
import React from "react";

const fetchForm = async (formId: string) => {
  const response = await fetch(`/api/promotions/forms/${formId}/manage`);
  const form = await response.json();
  console.log(form);
  return form;
};

const fetchPromotionDetail = async (publicId: string) => {
  const response = await fetch(`/api/promotions/detail/${publicId}`);
  const performance: PromotionDetail = await response.json();
  return performance;
};
export function PromotionManagePage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const performanceId = searchParams.get("performanceId");

  const { data: promotionDetail, isLoading: isPromotionDetailLoading } =
    useQuery({
      queryKey: ["promotionDetail", performanceId],
      queryFn: () => fetchPromotionDetail(performanceId ?? ""),
    });

  const { data: form, isLoading: isFormLoading } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => fetchForm(formId ?? ""),
    enabled: !!formId,
  });

  useEffect(() => {
    if (promotionDetail) {
      document.title = `풍덩 | ${promotionDetail.title} 관리`;
    } else {
      document.title = "풍덩 | 공연 관리";
    }
  }, [promotionDetail]);
  if (!formId) return null;
  if (isFormLoading || isPromotionDetailLoading)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  if (!form || !promotionDetail)
    return (
      <div className="flex items-center justify-center h-full w-full">
        폼을 찾을 수 없습니다.
      </div>
    );
  return (
    <div className="w-full bg-grey-100">
      <Header title="공연 관리" />
      <PromotionProfile
        posterUrl={
          promotionDetail.performanceImageInfoList?.[0]?.imageUrl || ""
        }
        title={promotionDetail.title}
        address={promotionDetail.address}
        startAt={promotionDetail.startAt}
      />
      <Space h={32} />
      <section
        className="w-full flex flex-col gap-[16px] px-[24px] py-[24px] flex-grow bg-background"
        id="response-list"
      >
        <div className="font-semibold text-grey-600 text-[16px] lg:text-[18px] ">
          신청자 총 {form.length}명
        </div>
        {[...form, ...form].map((form: ResponseDto, index: number) => (
          <ResponseBox
            key={form.responseId + index}
            form={form}
            promotionDetail={promotionDetail}
          />
        ))}
      </section>
    </div>
  );
}

interface AnswerDto {
  questionId: number;
  selectedOptions: QuestionOptionDto[];
  answerText: string | null;
}

interface ResponseDto {
  responseId: number;
  formId: number;
  submitterUsername: string;
  submitterNickname: string;
  submittedAt: string;
  answerList: AnswerDto[];
}
// responseId: 30,
//     formId: 26,
//     submitterUsername: 'ajtwoddl1236@naver.com',
//     submitterNickname: '강윤호',
//     submittedAt: '2025-09-20T18:18:55',
//     answerList: [ [Object] ]

const ResponseBox = React.memo(
  ({
    form,
    promotionDetail,
  }: {
    form: ResponseDto;
    promotionDetail: PromotionDetail;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    useEffect(() => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    }, [form.answerList]);

    return (
      <div
        ref={boxRef}
        className="flex flex-col w-full px-[12px] py-[16px] border border-grey-200 rounded-[8px] transition-all duration-300 ease-in"
      >
        <div
          className="flex flex-row gap-[4px] items-center cursor-pointer px-[12px]"
          onClick={handleToggle}
        >
          <div className="flex flex-col gap-[4px] flex-grow">
            <div className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
              {form.submitterUsername} ({form.submitterNickname})
            </div>
            <div className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
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
            {form.answerList.map((answer: AnswerDto) => {
              const question = promotionDetail.questions.find(
                (question: QuestionDto) => question.id === answer.questionId
              );
              return (
                <div
                  key={answer.questionId}
                  className="flex flex-col gap-[8px] p-[12px] bg-grey-50 rounded-[6px]"
                >
                  <h3 className="font-semibold text-grey-700 text-[14px] lg:text-[16px]">
                    Q{question?.orderNo}.
                  </h3>
                  <span className="font-medium text-grey-400 text-[14px] lg:text-[16px]">
                    {
                      promotionDetail.questions.find(
                        (question: QuestionDto) =>
                          question.id === answer.questionId
                      )?.label
                    }
                  </span>
                  <div className="text-grey-800 text-[13px] lg:text-[15px]">
                    {question?.questionType === "TEXT" ? (
                      <div>{answer.answerText}</div>
                    ) : (
                      <div>
                        {answer.selectedOptions
                          ?.map((option) => option.label)
                          .join(", ")}
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

ResponseBox.displayName = 'ResponseBox';