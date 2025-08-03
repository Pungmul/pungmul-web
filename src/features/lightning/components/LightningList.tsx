"use client";
import { useCallback, useEffect } from "react";
import { SwiperRef } from "swiper/react";
import { LightningMeeting } from "@/shared/types/lightning/type";
import { lightningMapStore } from "../store/lightningMapStore";
import { LightningCardList } from "./LightningCardList";

interface LightningListProps {
  userPartinLightning:
    | (LightningMeeting & {
        isOrganizer: boolean;
        participationStatus: boolean;
        chatRoomUUID: string | null;
      })
    | null;
  ref: React.RefObject<SwiperRef | null>;
}

export function LightningList(props: LightningListProps) {
  const { userPartinLightning, ref } = props;
  const {
    lightningList,
    focusedLightningIndex,
    target,
    setTarget,
    focusLightningByIndex,
  } = lightningMapStore();

  const onCardClick = useCallback(
    (lightningMeeting: LightningMeeting) => {
      // 카드 클릭 시 해당 lightning에 포커스
      const index = lightningList.findIndex(
        (lightning) => lightning.id === lightningMeeting.id
      );
      if (index !== -1) {
        focusLightningByIndex(index);
      }
    },
    [lightningList, focusLightningByIndex]
  );

  useEffect(() => {
    if (ref.current && focusedLightningIndex !== null) {
      ref.current.swiper.slideTo(focusedLightningIndex);
    }
  }, [focusedLightningIndex, ref.current]);

  return (
    <div className="relative z-10 bottom-0 w-full rounded-xl shadow-up-md bg-white overflow-hidden flex flex-col lg:h-full lg:w-[640px] gap-[16px] py-[16px] lg:py-[32px] lg:gap-[24px]">
      <div className="px-4 text-lg font-semibold">
        내 주변에 발생한 <span style={{ color: "#BBFF00" }}>번개</span>
      </div>

      <div className="flex flex-row gap-2 px-[24px]">
        {["전체", "우리학교"].map((item) => (
          <div
            key={"target-option-" + item}
            className={
              "text-sm border border-[#816DFF] rounded-lg px-2 py-2 cursor-pointer " +
              (target === item ? "text-white bg-[#816DFF]" : "text-[#816DFF]")
            }
            onClick={() => setTarget(item as "전체" | "우리학교")}
          >
            {item}
          </div>
        ))}
      </div>

      <LightningCardList
        ref={ref}
        lightningList={lightningList}
        userPartinLightning={userPartinLightning}
        onCardClick={onCardClick}
      />
    </div>
  );
}
