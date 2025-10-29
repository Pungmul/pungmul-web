import { SwiperSlide } from "swiper/react";
import { Swiper, SwiperRef } from "swiper/react";
import AddLightningCard from "../element/AddLightningCard";
import LightningCard from "../element/LightningCard";
import {
  LightningMeeting,
  UserParticipationData,
  LightningCardRefType,
} from "../../types";
import { useJoinLightningMeeting } from "../../queries";
import { useCallback, useEffect, useRef } from "react";

interface LightningCardListProps {
  lightningList: LightningMeeting[];
  userPartinLightning: UserParticipationData | undefined;
  ref: React.RefObject<SwiperRef | null>;
  callSheetUp?: () => void;
}

export function LightningCardList({
  lightningList,
  userPartinLightning,
  ref,
  callSheetUp,
}: LightningCardListProps) {
  const { mutate: joinLightning } = useJoinLightningMeeting();
  const itemRefs = useRef<Map<string, LightningCardRefType>>(new Map());
  const currentFocusedRef = useRef<LightningCardRefType | null>(null);
  const refObjects = useRef<
    Map<string, React.RefObject<LightningCardRefType | null>>
  >(new Map());

  const getRef = useCallback((id: string) => {
    if (!refObjects.current.has(id)) {
      const refObj = { current: null as LightningCardRefType | null };
      refObjects.current.set(id, refObj);
    }
    return refObjects.current.get(id)!;
  }, []);

  useEffect(() => {
    if (ref.current && lightningList.length > 0) {
      ref.current?.swiper.on("slideChange", (swiper) => {
        console.log("slideChange", swiper.activeIndex);
        const id = lightningList[swiper.activeIndex]?.id ?? "";
        currentFocusedRef.current?.blur();
        currentFocusedRef.current = getRef(id.toString())?.current;
        currentFocusedRef.current?.focus();
      });
    }
  }, [lightningList]);

  return (
    <Swiper
      ref={ref}
      slidesPerView={"auto"}
      spaceBetween={12}
      centeredSlides={true}
      // pagination={{
      //   dynamicBullets: true,
      //   clickable: true,
      // }}
      // modules={[Pagination]}
      className="w-full py-[24px]"
    >
      {/* 스와이프 영역 */}
      <>
        {lightningList.length === 0 && userPartinLightning?.participant ? (
          <SwiperSlide
            style={{
              width: "calc(100% - 48px)",
              maxWidth: 342,
              height: 328,
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-lg font-semibold">번개가 없습니다.</div>
            </div>
          </SwiperSlide>
        ) : (
          [...lightningList].map((lightningMeeting, index) => (
            <SwiperSlide
              key={"lightning-card-" + lightningMeeting.id}
              style={{
                width: "calc(100% - 48px)",
                maxWidth: 342,
                height: 328,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={async () => {
                const focusedIndex = ref.current?.swiper.activeIndex;
                if (focusedIndex === index) {
                  callSheetUp?.();
                } else if (ref) {
                  ref.current?.swiper.slideTo(index);
                  currentFocusedRef.current?.blur();
                  currentFocusedRef.current = getRef(
                    lightningMeeting.id.toString()
                  )?.current;
                  currentFocusedRef.current?.focus();
                }
              }}
            >
              <LightningCard
                isParticipated={
                  lightningMeeting.id ===
                  userPartinLightning?.lightningMeeting?.id
                }
                onJoinLightning={({ meetingId }) => {
                  if (
                    confirm(
                      "번개에 참여하시겠습니까? 번개 참여 후 참여 취소는 불가능합니다."
                    )
                  ) {
                    // TanStack Query mutation 사용
                    joinLightning({ meetingId });
                  }
                }}
                ref={getRef(lightningMeeting.id.toString())}
                onRefSet={(ref) =>
                  itemRefs.current.set(lightningMeeting.id.toString(), ref)
                }
                {...lightningMeeting}
              />
            </SwiperSlide>
          ))
        )}
        {!userPartinLightning?.participant && (
          <SwiperSlide
            style={{ width: "calc(100% - 48px)", maxWidth: 342, height: 328 }}
          >
            <AddLightningCard />
          </SwiperSlide>
        )}
      </>
    </Swiper>
  );
}
