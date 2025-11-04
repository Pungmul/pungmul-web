"use client";

import { Navigation, FreeMode } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";

import { useRouter } from "next/navigation";
import { useUserLocation, updateLocation } from "@pThunder/features/location";
import React, { use } from "react";
import { useNearLightningQuery } from "@pThunder/features/home";
import NearLightningCard from "../element/NearLightningCard";
import { ThunderIconFilled } from "@pThunder/shared/components/Icons";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { NearLightningSkeleton } from "../element/NearLightningSkeleton";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SuspenseComponent as Suspense } from "@/shared";

// 모듈 레벨에서 Promise를 캐싱 (컴포넌트 리마운트 시에만 새로 생성)
// 리렌더링 되어도 같은 Promise를 사용
let updateLocationPromise: Promise<unknown> | null = null;

export function NearLightningContent() {
  const [retryKey, setRetryKey] = useState(0);
  const queryClient = useQueryClient();

  const handleRetry = async () => {
    // React Query 캐시 무효화
    await queryClient.invalidateQueries({ queryKey: ["location", "user"] });
    await queryClient.resetQueries({ queryKey: ["location", "user"] });

    await queryClient.invalidateQueries({ queryKey: ["nearLightning"] });
    await queryClient.resetQueries({ queryKey: ["nearLightning"] });
    
    // 새로운 Promise 생성 (리마운트 시 사용)
    updateLocationPromise = updateLocation();

    // 컴포넌트 리마운트
    setRetryKey((prev) => prev + 1);
  };
  return (
    <ErrorBoundary
      resetKeys={[retryKey]}
      onReset={handleRetry}
      FallbackComponent={(props) => <NearLightningContentError {...props} />}
    >
      <Suspense clientOnly fallback={<NearLightningSkeleton />}>
        <NearLightning key={retryKey} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default function NearLightning() {
  const { data: serverLocation } = useUserLocation();

  // 위치 정보가 없을 때만 Promise 생성 및 사용
  if (
    !serverLocation ||
    !serverLocation?.latitude ||
    !serverLocation?.longitude
  ) {
    // Promise가 없으면 새로 생성
    if (!updateLocationPromise) {
      updateLocationPromise = updateLocation();
    }
    use(updateLocationPromise);
  } else {
    // 위치 정보가 있으면 Promise 초기화 (다음에 필요할 때 새로 생성)
    updateLocationPromise = null;
  }

  const { data: nearLightning, isError } = useNearLightningQuery();

  const router = useRouter();

  // 에러 발생 시 에러 메시지 표시
  if (isError) {
    throw new Error("Near Lightning 데이터를 불러오는데 실패했습니다.");
  }

  return (
    <div className="relative w-full px-[16px]">
      <Swiper
        grabCursor={true}
        modules={[Navigation, FreeMode]}
        className="mySwiper w-full h-full"
        slidesPerView="auto"
        spaceBetween={12}
      >
        <>
          {nearLightning && nearLightning.length > 0
            ? nearLightning.map((nearLightning) => (
                <SwiperSlide
                  key={
                    "near-lightning-card-" + nearLightning.lightningMeeting.id
                  }
                  className="!w-[280px] !aspect-[16/9]"
                >
                  <NearLightningCard {...nearLightning} />
                </SwiperSlide>
              ))
            : null}
          <SwiperSlide
            key={"add-card-slide"}
            className="!w-[280px] !aspect-[16/9] cursor-pointer bg-background rounded-[4px] border-[2px] border-dashed border-grey-400"
            onClick={() => {
              router.push(
                "/lightning" +
                  (nearLightning && nearLightning.length > 0
                    ? ""
                    : "?create=true")
              );
            }}
          >
            <div className="cursor-pointer flex flex-col items-center justify-center h-full gap-2">
              {nearLightning && nearLightning.length == 0 && (
                <div className="flex flex-col items-center justify-center gap-1">
                  <h1 className="text-center text-grey-400 font-normal text-sm">
                    지금 근처에 번개가 없어요.
                  </h1>
                  <h1 className="text-center text-grey-400 font-normal text-sm">
                    번개를 만들어보세요.
                  </h1>
                </div>
              )}
              <ThunderIconFilled className="size-[48px] text-grey-800" />
              <h1 className="text-center text-grey-400 font-semibold text-sm">
                {nearLightning && nearLightning.length > 0
                  ? "번개 더 찾아보기"
                  : "번개 만들기"}
              </h1>
            </div>
          </SwiperSlide>
        </>
      </Swiper>
      <div className="swiper-pagination"></div>
    </div>
  );
}

export function NearLightningContentError({
  resetErrorBoundary,
}: FallbackProps) {
  const handleRetry = () => {
    // retryKey 변경 → resetKeys 변경 → ErrorBoundary 리셋 → 컴포넌트 리렌더링
    resetErrorBoundary();
  };

  return (
    <div className="w-full relative">
      <div className="mx-auto text-center w-[280px] aspect-[16/9] flex flex-col items-center justify-center">
        <p className="text-grey-400 mb-2">근처 번개를 불러오는데 실패했어요.</p>
        <button
          onClick={handleRetry}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
