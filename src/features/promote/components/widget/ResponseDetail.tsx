"use client";
import React, { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import dayjs from "dayjs";

import { getQueryClient } from "@pThunder/core";
import { Header, Button } from "@pThunder/shared";

import {
  type AnswerDto,
  type PromotionDetail,
  type QuestionDto,
  type PromotionResponseDetailDto,
} from "@pThunder/features/promote";

import {
  PromotionProfile,
  useCancelResponseRequest,
  usePromotionDetailQuery,
  usePromotionResponseDetail,
} from "@pThunder/features/promote";

export default function ResponseDetail({ responseId }: { responseId: string }) {
  // 첫 번째 쿼리: 응답 상세 정보 가져오기 (Suspense로 순차 실행 보장)
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = getQueryClient();

  // 관련된 모든 쿼리 무효화

  const targetPerformanceKey = searchParams.get("targetPerformanceKey");
  const { data: promotionResponseDetail } =
    usePromotionResponseDetail(responseId);
  const { data: promotionDetail } = usePromotionDetailQuery(
    targetPerformanceKey!
  );

  const { mutate: cancelResponse } = useCancelResponseRequest();

  const handleCancelResponse = useCallback(() => {
    if (confirm("공연 관람 신청을 취소하시겠습니까?")) {
      cancelResponse(promotionResponseDetail.formId.toString(), {
        onSuccess: () => {
          return queryClient
            .invalidateQueries({
              queryKey: ["upcomingPerformanceList", responseId],
            })
            .then(() => {
              router.replace(`/board/promote/upcoming`);
            });
        },
        onError: (error) => {
          alert(error.message);
        },
      });
    }
  }, [cancelResponse]);

  return (
    <>
      <Header title={promotionDetail.title}/>
      <PromotionProfile
        posterUrl={
          promotionDetail.performanceImageInfoList?.[0]?.imageUrl || ""
        }
        title={promotionDetail.title}
        address={promotionDetail.address}
        startAt={promotionDetail.startAt}
      />
      <section className="w-full flex flex-col gap-[16px] px-[24px] py-[24px] flex-grow bg-background">
        <h3>{dayjs(promotionResponseDetail.submittedAt).format("YYYY.MM.DD (ddd)")}에 작성한 나의 답변</h3>
        <ResponseBox
          form={promotionResponseDetail}
          promotionDetail={promotionDetail}
        />
      </section>
      <section className="w-full flex justify-center px-[24px] py-[24px] bg-background">
        <Button onClick={handleCancelResponse}>취소하기</Button>
      </section>
    </>
  );
}

const ResponseBox = React.memo(
  ({
    form,
    promotionDetail,
  }: {
    form: PromotionResponseDetailDto;
    promotionDetail: PromotionDetail;
  }) => {
    return (
      <div className="flex flex-col w-full px-[12px] py-[16px] border border-grey-200 rounded-[8px]">
        <div className="flex flex-col gap-[12px] pt-[12px]">
          {form.answerList.map((answer: AnswerDto) => {
            if (!promotionDetail.questions) {
              return null;
            }
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
    );
  }
);

ResponseBox.displayName = "ResponseBox";