'use client';

import { LightningMeeting } from "@/shared/types/lightning/type";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import LocationIcon from "@public/icons/Location-icon.svg";
import Image from "next/image";
import { getQueryClient } from "@/core";

interface LightningCardProps extends LightningMeeting {
  isParticipated?: boolean;
  organizerName?: string;
}

// export interface LightningMeeting {
//   id: number;
//   meetingName: string;
//   recruitmentEndTime: string; // ISO 날짜 문자열
//   startTime: string;
//   endTime: string;
//   minPersonNum: number;
//   maxPersonNum: number;
//   organizerId: number;
//   meetingType: "FREE" | "PLAY" | "STUDY" | string; // 다른 타입이 있을 수 있으므로 string 포함
//   latitude: number;
//   longitude: number;
//   buildingName: string;
//   locationDetail: string;
//   tags: (typeof LIGHTNING_TAGS)[number][];
//   lightningMeetingParticipantList: unknown[]; // 타입이 정의되지 않아 any[]로 처리
//   instrumentAssignmentList: unknown[]; // 타입이 정의되지 않아 any[]로 처리
//   status: "OPEN" | "CLOSED" | "CANCELLED" | "SUCCESS" | "READY";
//   notificationSent: boolean;
//   visibilityScope: "ALL" | "PRIVATE" | string;
//   createdAt: string;
//   updatedAt: string;
// }

const LightningCard: React.FC<LightningCardProps> = ({
  isParticipated = false,
  organizerName = "",
  ...lightningMeeting
}) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const queryClient = getQueryClient()
  useEffect(() => {
    const calculateRemainingTime = () => {
      const updatedRecruitmentEndTime = dayjs(
        lightningMeeting.recruitmentEndTime
      ).tz();
      const updatedNow = dayjs().tz();
      const diffSeconds = updatedRecruitmentEndTime.diff(updatedNow, "seconds");
      if(diffSeconds < 0) {
        setRemainingTime(0);
        // 마감 시간이 지나면 주변 번개 목록 갱신
        queryClient.invalidateQueries({ queryKey: ["near-lightnings"] });
      }
      setRemainingTime(diffSeconds);
    };
    calculateRemainingTime(); // 컴포넌트 마운트 시 즉시 실행
    const timer = setInterval(() => {
      // 컴포넌트가 마운트된 후 1초마다 업데이트
      calculateRemainingTime();
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [lightningMeeting, queryClient]);

  return (
    <div
      className={
        " bg-[#000000] overflow-hidden flex flex-col justify-end gap-[16px] border border-gray-200 rounded-[16px] " +
        (isParticipated ? "p-[8px]" : "p-[16px]")
      }
      style={{
        width: isParticipated ? "calc(100% - 8px)" : "100%",
        height: isParticipated ? "calc(100% - 8px)" : "100%",
      }}
    >
      <h1 className="text-white text-center font-semibold text-[18px]">
        {lightningMeeting.meetingName}
      </h1>
      <div className="flex flex-col items-end text-white">
        <div className="flex flex-row items-center justify-between gap-[8px]"> 
          <Image src={LocationIcon} alt="location" className="p-[4px]" width={24} height={24}/>
          <h3 className="text-[11px] font-semibold">
            {lightningMeeting.buildingName},{" "}
            {lightningMeeting.locationDetail}
          </h3>
        </div>
        <h3 className="text-[11px] font-semibold">
            {organizerName}
          </h3>
        <h3 className="text-[11px]">
          {dayjs(lightningMeeting.startTime).format("HH:mm")}~
          {dayjs(lightningMeeting.endTime).format("HH:mm")}
        </h3>
        <div className="flex flex-row items-center justify-between w-full">
          <h4 className="text-[11px]">{isParticipated ? " (참여 중)" : ""}</h4>
          <h4 className="text-[11px]">
            {remainingTime > 60
              ? Math.floor(remainingTime / 60) + "분 후 마감"
              : remainingTime + "초 후 마감"}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default LightningCard;