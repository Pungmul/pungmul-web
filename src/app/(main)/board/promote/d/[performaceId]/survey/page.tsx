"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Header, Space, Spinner } from "@/shared";
import {
  PromotionSurveyPage as PromotionSurveyPageComponent,
  PromotionSummaryCard,
  loadPromotionDetail,
  submitPromotionSurvey,
} from "@/features/promote";

import { useEffect } from "react";
import type {
  PromotionDetail,
  PromotionSurveyAnswerRequest,
} from "@/features/promote";
export default function PromotionSurveyPage() {
  const router = useRouter();

  const { performaceId } = useParams<{ performaceId: string }>();
  const { data: promotionDetail, isLoading: isPromotionDetailLoading } =
    useQuery<PromotionDetail>({
      queryKey: ["promotionDetail", performaceId],
      queryFn: () => loadPromotionDetail(performaceId),
    });

  const { mutate: submitAnswerMutation } = useMutation({
    mutationFn: (answerList: PromotionSurveyAnswerRequest[]) => {
      return submitPromotionSurvey(performaceId, answerList);
    },
  });

  useEffect(() => {
    if (promotionDetail) {
      document.title = `풍덩 | ${promotionDetail.title} 설문`;
    } else {
      document.title = "풍덩 | 공연 설문";
    }
  }, [promotionDetail]);

  return (
    <div className="w-full flex flex-col bg-grey-100">
      <div className="w-full flex flex-col gap-[12px] md:max-w-[768px] mx-auto min-h-screen bg-background">
        {isPromotionDetailLoading ? (
          <>
            <Header title={""} isBackBtn={false} />
            <div className="w-full flex flex-col items-center justify-center">
              <Spinner size={32} />
            </div>
          </>
        ) : (
          <>
            <Header
              title={promotionDetail?.title || ""}
              onLeftClick={() => {
                if (confirm("공연 신청을 중단할까요?")) {
                  router.back();
                }
              }}
            />
            <main className="w-full flex flex-col bg-grey-100 flex-grow">
              <PromotionSummaryCard
                posterImage={
                  promotionDetail?.performanceImageInfoList?.[0]?.imageUrl || ""
                }
                title={promotionDetail?.title || ""}
                address={promotionDetail?.address || null}
                startAt={promotionDetail?.startAt || ""}
              />
              <Space h={24} />
              <PromotionSurveyPageComponent
                questions={promotionDetail?.questions || []}
                onSubmit={(answers) => {
                  const answerList: PromotionSurveyAnswerRequest[] =
                    Object.entries(answers).map(([questionId, answer]) => ({
                      questionId: Number(questionId),
                      selectedOptionIds: answer.selectedOptionIds || [],
                      answerText: answer.answerText || null,
                    }));
                  submitAnswerMutation(answerList, {
                    onSuccess: () => {
                      alert("설문이 성공적으로 제출되었습니다!");
                      router.replace(`/board/promote/d/${performaceId}`);
                    },
                    onError: () => {
                      alert("설문 제출 중 오류가 발생했습니다.");
                    },
                  });
                }}
              />
            </main>
          </>
        )}
      </div>
    </div>
  );
}
