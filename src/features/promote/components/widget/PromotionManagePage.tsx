"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Header, Space, Spinner } from "@pThunder/shared";
import { PromotionDetail, ResponseDto } from "../../types";
import { PromotionProfile } from "./PromotionProfile";
import { StatisticsTabs } from "./StatisticsTabs";
import { useEffect } from "react";

const fetchForm = async (formId: string): Promise<ResponseDto[]> => {
  const response = await fetch(`/api/promotions/forms/${formId}/manage`);
  const form: ResponseDto[] = await response.json();
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
        className="w-full flex flex-col flex-grow bg-background"
        id="response-list"
      >
        <StatisticsTabs responses={form} promotionDetail={promotionDetail} />
      </section>
    </div>
  );
}
