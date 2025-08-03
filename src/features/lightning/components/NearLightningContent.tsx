"use client";

import { EffectCards } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import LightningCard from "./LightningCard";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SkeletonView } from "@/shared/components";
import { useUserLocation } from "@pThunder/features/location";
import { updateLocation } from "@pThunder/features/location/hooks/useLocation";
import { use } from "react";
import { useNearLightningQuery } from "@pThunder/features/home/utils";

export default function NearLightningContent() {
  const { data: serverLocation } = useUserLocation();
  if (!serverLocation) {
    use(updateLocation);
  }
  const { data: nearLightning, isError } = useNearLightningQuery();

  const router = useRouter();

  // 에러 발생 시 에러 메시지 표시
  if (isError) {
    return (
      <div className="w-full h-[240px] md:h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">정보를 불러오는데 실패했습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-[24px]">
      <div className="w-full md:w-[640px] h-[240px] md:h-[400px]">
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper flex items-center justify-center w-full h-full"
        >
          <>
            {nearLightning && nearLightning.length > 0
              ? nearLightning.map(
                  ({ lightningMeeting, ...lightning }, index) => {
                    console.log(lightning);
                    return (
                      <SwiperSlide
                        className="h-full cursor-pointer"
                        key={index + "card-slide"}
                        style={{
                          backgroundColor: "#FFF",
                          borderRadius: 16,
                        }}
                      >
                        <LightningCard organizerName={lightning.organizerName}  {...lightningMeeting} />
                      </SwiperSlide>
                    );
                  }
                )
              : null}
            <SwiperSlide
              key={"add-card-slide"}
              className="h-full cursor-pointer"
              style={{
                backgroundColor: "#FFF",
                borderRadius: 16,
                border: "2px dashed #D9D9D9",
              }}
              onClick={() => {
                router.push(
                  "/lightning" +
                    (nearLightning && nearLightning.length > 0
                      ? ""
                      : "?create=true")
                );
              }}
            >
              <div className="cursor-pointer flex flex-col items-center justify-center h-full">
                {nearLightning && nearLightning.length == 0 && (
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
                  {nearLightning && nearLightning.length > 0
                    ? "번개 더 찾아보기"
                    : "번개 만들러 가기"}
                </h1>
              </div>
            </SwiperSlide>
          </>
        </Swiper>
      </div>
    </div>
  );
}

export function NearLightningContentFallback() {
  return (
    <div className="w-full h-[240px] md:h-[400px] flex items-center justify-center px-[36px]">
      <SkeletonView className="w-full h-[240px] md:h-[400px] rounded-lg relative" />
    </div>
  );
}

export function NearLightningContentError() {
  return (
    <div className="w-full h-[240px] md:h-[400px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-2">정보를 불러오는데 실패했습니다.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
