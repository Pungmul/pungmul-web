'use client';

import { LightningMeeting } from "@/shared/types/lightning/type";
import "@/app/globals.css";
import dayjs from "@/shared/lib/dayjs";
import { useEffect, useState } from "react";

interface LightningCardProps extends LightningMeeting {
  isParticipated?: boolean;
}

const LightningCard: React.FC<LightningCardProps> = ({
  isParticipated = false,
  ...lightningMeeting
}) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const updatedRecruitmentEndTime = dayjs(
        lightningMeeting.recruitmentEndTime
      ).tz();
      const updatedNow = dayjs().tz();
      const diffSeconds = updatedRecruitmentEndTime.diff(updatedNow, "seconds");
      setRemainingTime(diffSeconds);
    };
    calculateRemainingTime(); // 컴포넌트 마운트 시 즉시 실행
    const timer = setInterval(() => {
      // 컴포넌트가 마운트된 후 1분마다 업데이트
      calculateRemainingTime();
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [lightningMeeting.recruitmentEndTime]);

  return (
    <div
      className={
        " bg-white overflow-hidden flex flex-col justify-end gap-[16px] border border-gray-200 rounded-[16px] " +
        (isParticipated ? "p-[8px]" : "p-[16px]")
      }
      style={{
        width: isParticipated ? "calc(100% - 8px)" : "100%",
        height: isParticipated ? "calc(100% - 8px)" : "100%",
      }}
    >
      <h1 className="text-black text-center font-semibold text-[18px]">
        {lightningMeeting.meetingName}
      </h1>
      <div className="flex flex-col items-end text-gray-600">
        <h3>
          {dayjs(lightningMeeting.startTime).format("HH:mm")}~
          {dayjs(lightningMeeting.endTime).format("HH:mm")}
        </h3>
        <div className="flex flex-row items-center justify-between w-full">
          <h4 className="text-sm">{isParticipated ? " (참여 중)" : ""}</h4>
          <h4>
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