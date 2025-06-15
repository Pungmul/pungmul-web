"use client";

import { EffectCards } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import LightningCard from "./LightningCard";

import Image from "next/image";
import { useNearLightning } from "@/app/(main)/home/utils";
import { SkeletonView } from "@/shared/components";
import { usePatchLocation } from "@/app/(main)/home/usePatchLocation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NearLightningComponent() {
  const { location } = usePatchLocation();
  const router = useRouter();
  const { data: nearLightning, isLoading, error, refetch } = useNearLightning();

  useEffect(() => {
    if (location) {
      refetch();
    }
  }, [location, refetch]);

  if (isLoading)
    return (
      <div className="w-full h-[400px] flex items-center justify-center px-[36px]">
        <SkeletonView className="w-full h-[400px] rounded-lg relative" />
      </div>
    );

  if (!nearLightning || error)
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        정보를 불러오는데 실패했습니다.
      </div>
    );

  return (
    <div className="flex flex-col relative" style={{ gap: 20 }}>
      <div
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        근처에서 생긴 번개
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-[640px]">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper flex items-center justify-center"
          >
            <>
              {nearLightning.length > 0
                ? nearLightning.map(
                    ({ lightningMeeting, ...lightning }, index) => {
                      console.log(lightning);
                      return (
                        <SwiperSlide
                          className="cursor-pointer"
                          key={index + "card-slide"}
                          style={{
                            height: 400,
                            backgroundColor: "#FFF",
                            borderRadius: 16,
                          }}
                        >
                          <LightningCard {...lightningMeeting} />
                        </SwiperSlide>
                      );
                    }
                  )
                : null}
              <SwiperSlide
                key={"add-card-slide"}
                style={{
                  height: 400,
                  backgroundColor: "#FFF",
                  borderRadius: 16,
                  border: "2px dashed #D9D9D9",
                }}
                onClick={() => {
                  router.push(
                    "/lightning" +
                      (nearLightning.length > 0 ? "" : "?create=true")
                  );
                }}
              >
                <div className="cursor-pointer flex flex-col items-center justify-center h-full">
                  {nearLightning.length == 0 && (
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-center text-gray-400 font-bold">
                        현재 근처에 번개가 없어요.
                      </h1>
                      <h1 className="text-center text-gray-400 font-bold">
                        번개를 만들어보세요.
                      </h1>
                    </div>
                  )}
                  <Image
                    src={"/icons/Thunder-Icon-filled.svg"}
                    width={48}
                    height={64}
                    alt=""
                    color="#D9D9D9"
                    className="mx-auto mt-8 mb-4"
                  />
                  <h1 className="text-center text-gray-400 font-bold">
                    {nearLightning.length > 0
                      ? "번개 더 찾아보기"
                      : "번개 만들러 가기"}
                  </h1>
                </div>
              </SwiperSlide>
            </>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
