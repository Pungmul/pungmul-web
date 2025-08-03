import { Pagination } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { Swiper, SwiperRef } from "swiper/react";
import AddLightningCard from "./element/AddLightningCard";
import LightningCard from "./LightningCard";
import { LightningMeeting } from "@pThunder/shared";
import { useJoinLightningMeeting } from "../api";

interface LightningCardListProps {
  lightningList: LightningMeeting[];
  userPartinLightning:  | (LightningMeeting & {
    isOrganizer: boolean;
    participationStatus: boolean;
    chatRoomUUID: string | null;
  })
| null;
  ref: React.RefObject<SwiperRef|null>;
  onCardClick: (lightningMeeting: LightningMeeting) => void;
}

export function LightningCardList({
  lightningList,
  userPartinLightning,
  ref,
  onCardClick,
}: LightningCardListProps) {
  const { mutate: joinLightning } = useJoinLightningMeeting();

  return (
    <Swiper
      ref={ref}
      slidesPerView={"auto"}
      spaceBetween={36}
      centeredSlides={true}
      pagination={{
        dynamicBullets: true,
        clickable: true,
      }}
      modules={[Pagination]}
      className="w-full py-[24px]"
    >
      {/* 스와이프 영역 */}
      <>
        {lightningList.length === 0 && userPartinLightning?.participationStatus ? (
          <SwiperSlide
            style={{
              width: 280,
              height: 168,
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-lg font-semibold">번개가 없습니다.</div>
            </div>
          </SwiperSlide>
        ) : (
          lightningList.map((lightningMeeting, index) => (
            <SwiperSlide
              key={"lightning-card-" + lightningMeeting.id}
              style={{
                width: 280,
                height: 168,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={async () => {
                if (
                  lightningMeeting.id ===
                  userPartinLightning?.id
                ) {
                  // setWaitingView(true);
                } else if (ref) {
                  ref.current?.swiper.slideTo(index);
                  if (
                    confirm(
                      "번개에 참여하시겠습니까? 번개 참여 후 참여 취소는 불가능합니다."
                    )
                  ) {
                    // TanStack Query mutation 사용
                    joinLightning(lightningMeeting.id);
                  }
                }
                onCardClick(lightningMeeting);
              }}
            >
              {lightningMeeting.id ===
                userPartinLightning?.id && (
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    left: -2,
                    width: "calc(100% + 4px)",
                    height: "calc(100% + 4px)",
                    zIndex: -1,
                    backgroundColor: "rgba(91, 43, 153, 0.12)",
                    borderRadius: 24,
                    overflow: "hidden",
                  }}
                >
                  <div className="ligtning-card-sign" />
                </div>
              )}
              <LightningCard
                isParticipated={
                  lightningMeeting.id ===
                  userPartinLightning?.id
                }
                {...lightningMeeting}
              />
            </SwiperSlide>
          ))
        )}
        {!userPartinLightning?.participationStatus && (
          <SwiperSlide style={{ width: 270, height: 160 }}>
            <AddLightningCard />
          </SwiperSlide>
        )}
      </>
    </Swiper>
  );
}
