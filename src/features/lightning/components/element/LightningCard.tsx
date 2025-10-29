"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import dayjs from "dayjs";

import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";

import { Button } from "@pThunder/shared";
import type { LightningCardRefType, LightningMeeting } from "../../types";
import "@/app/globals.css";

interface LightningCardProps extends LightningMeeting {
  isParticipated?: boolean;
  organizerName?: string;
  onJoinLightning?: ({ meetingId }: { meetingId: number }) => void;
  ref?: React.RefObject<LightningCardRefType | null>;
  onRefSet?: (ref: LightningCardRefType) => void;
}

const LightningCard: React.FC<LightningCardProps> = ({
  isParticipated = false,
  onJoinLightning,
  ref,
  onRefSet,
  ...lightningMeeting
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        setIsFocused(true);
      },
      blur: () => {
        setIsFocused(false);
      },
    }),
    []
  );

  // ref 객체의 current 값을 설정하고 Map에 저장
  useEffect(() => {
    if (ref) {
      const refValue = {
        focus: () => setIsFocused(true),
        blur: () => setIsFocused(false),
      };
      ref.current = refValue;
      onRefSet?.(refValue);
    }
  }, [ref, onRefSet]);

  return (
    <div
      className={`w-full h-full bg-background overflow-hidden flex flex-col gap-[12px] border-[2px] rounded-[4px] py-[12px] ${
        isFocused ? "border-primary" : "border-grey-200"
      }`}
      ref={focusRef}
    >
      <div className="flex flex-col flex-grow gap-[12px]">
        <div className="flex flex-row items-center justify-between px-[12px]">
          <div className="text-grey-500 text-[12px] font-normal p-[4px] bg-grey-200 rounded-[4px]">
            {lightningMeeting.meetingType ? "일반 모임" : "풍물 모임"}
          </div>
          <LighningRemainingTime
            recruitmentEndTime={lightningMeeting.recruitmentEndTime}
          />
        </div>
        <h1 className="text-grey-800 text-center font-semibold text-[16px] h-[36px]">
          {lightningMeeting.meetingName}
        </h1>
        <LightningCardInfo 
          locationDetail={lightningMeeting.locationDetail}
          startTime={lightningMeeting.startTime}
          endTime={lightningMeeting.endTime}
        />
      </div>
      <LightningCardButton
        isParticipated={isParticipated}
        meetingId={lightningMeeting.id}
        {...(onJoinLightning && { onJoinLightning })}
      />
    </div>
  );
};

export default memo(LightningCard);

const LightningCardInfo = memo(({
  locationDetail,
  startTime,
  endTime,
}: {
  locationDetail: string;
  startTime: string;
  endTime: string;
}) => {
  return (
    <div className="flex flex-col items-start px-[12px] gap-[8px]">
      <div className="flex flex-row items-end justify-between gap-[4px]">
        <MapPinIcon className="size-[24px] text-primary" />
        <h3 className="text-[14px] font-light text-grey-600">
          {locationDetail}
        </h3>
      </div>
      <div className="flex flex-row items-end justify-between gap-[4px]">
        <ClockIcon className="size-[24px] text-primary" />
        <h3 className="text-[14px] font-light text-grey-600">
          {dayjs(startTime).format("HH:mm")}~
          {dayjs(endTime).format("HH:mm")}
        </h3>
      </div>
    </div>
  );
});

const LightningCardButton = memo(({
  isParticipated,
  meetingId,
  onJoinLightning,
}: {
  isParticipated: boolean;
  meetingId: number;
  onJoinLightning?: ({ meetingId }: { meetingId: number }) => void;
}) => {
  const handleClick = useCallback(() => {
    onJoinLightning?.({ meetingId });
  }, [onJoinLightning, meetingId]);

  return (
    <div className="px-[12px]">
      <Button
        className="!disabled:bg-grey-200 !disabled:text-grey-500 !disabled:cursor-not-allowed bg-primary text-background"
        onClick={handleClick}
        disabled={isParticipated}
      >
        {isParticipated ? "(번개 참여중)" : "번개 참여하기"}
      </Button>
    </div>
  );
});

LightningCardInfo.displayName = 'LightningCardInfo';
LightningCardButton.displayName = 'LightningCardButton';

const LighningRemainingTime = memo(({
  recruitmentEndTime,
}: {
  recruitmentEndTime: string;
}) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const updatedRecruitmentEndTime = dayjs(recruitmentEndTime).tz();
      const updatedNow = dayjs().tz();
      const diffSeconds = updatedRecruitmentEndTime.diff(updatedNow, "seconds");
      if (diffSeconds < 0) {
        setRemainingTime(0);
        // 마감 시간이 지나면 주변 번개 목록 갱신

        // queryRefresher();
      } else {
        if(diffSeconds < 60) {
          setRemainingTime(diffSeconds);
        } else {
          setRemainingTime(Math.floor(diffSeconds / 60) * 60);
        }
      }
    };
    calculateRemainingTime(); // 컴포넌트 마운트 시 즉시 실행
    const timer = setInterval(() => {
      // 컴포넌트가 마운트된 후 1초마다 업데이트
      calculateRemainingTime(); 
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [recruitmentEndTime]);

  return (
    <div className="text-grey-800 text-[14px] font-semibold">
      {remainingTime > 60
        ? Math.floor(remainingTime / 60) + "분 후 마감"
        : remainingTime + "초 후 마감"}
    </div>
  );
});

LighningRemainingTime.displayName = 'LighningRemainingTime';
