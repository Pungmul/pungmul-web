"use client";
import { ResponseDto, PromotionDetail } from "../../types";
import { ResponseBox } from "./ResponseBox";
import { calculateStatistics, exportToExcel } from "../../services";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface IndividualResponsesTabProps {
  responses: ResponseDto[];
  promotionDetail: PromotionDetail;
}

export function IndividualResponsesTab({
  responses,
  promotionDetail,
}: IndividualResponsesTabProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const statistics = calculateStatistics(responses, promotionDetail.questions);
      await exportToExcel(responses, statistics, promotionDetail);
    } catch (error) {
      console.error("엑셀 내보내기 실패:", error);
      alert("엑셀 내보내기에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-[16px] px-[24px]">
      <div className="flex flex-row items-center justify-between">
        <div className="font-semibold text-grey-600 text-[16px] lg:text-[18px]">
          신청자 총 {responses.length}명
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting || responses.length === 0}
          className="flex flex-row items-center gap-[8px] px-[16px] py-[8px] bg-primary text-background rounded-[8px] text-[14px] font-medium disabled:bg-grey-300 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
        >
          <ArrowDownTrayIcon className="w-[16px] h-[16px]" />
          {isExporting ? "내보내는 중..." : "엑셀 다운로드"}
        </button>
      </div>
      <div className="flex flex-col gap-[16px]">
        {responses.map((response) => (
          <ResponseBox
            key={response.responseId}
            form={response}
            promotionDetail={promotionDetail}
          />
        ))}
        {responses.length === 0 && (
          <div className="flex items-center justify-center py-[48px] text-grey-400 text-[14px]">
            신청자가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}


