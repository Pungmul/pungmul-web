"use client";
import { useKakaoMapsEffect } from "@/shared/hooks";
import type { LightningMeeting } from "../types";
import { LocationType } from "@/features/location";
import { createLightningCircle } from "../lib";
import { SwiperRef } from "swiper/react";
import { Swiper } from "swiper/types";

interface UseLightningMarkersProps {
  mapRef: React.RefObject<kakao.maps.Map | null>;
  markersRef: React.RefObject<
    { marker: kakao.maps.Marker; circle: kakao.maps.Circle }[]
  >;
  lightningList: LightningMeeting[];
  panToCenter: (location: LocationType) => void;
  swiperRef: React.RefObject<SwiperRef | null>;
  target: "전체" | "우리학교";
}

export const useLightningMarkers = ({
  mapRef,
  markersRef,
  lightningList,
  panToCenter,
  swiperRef,
  target,
}: UseLightningMarkersProps) => {
  // 번개 마커 최신화
  useKakaoMapsEffect(() => {
    // 마커 제거
    markersRef.current.forEach(({ marker, circle }) => {
      circle.setMap(null);
      marker.setMap(null);
    });

    // 마커 초기화
    markersRef.current = [];

    if (lightningList.length === 0) return;
    if (mapRef.current) {
      // 마커 생성
      lightningList.forEach(({ latitude, longitude }, index) => {
        const { marker, circle } = createLightningCircle({
          locationPoint: {
            latitude,
            longitude,
          },
          onClick: () => {
            panToCenter({ latitude, longitude });
            swiperRef.current?.swiper.slideTo(index);
          },
        });
        markersRef.current.push({ marker, circle });

        marker.setMap(mapRef.current);
        circle.setMap(mapRef.current);
      });
    }
  }, [target, lightningList]);

  // 스와이퍼 이동 이벤트 처리
  useKakaoMapsEffect(() => {
    if (swiperRef.current && lightningList.length > 0) {
      swiperRef.current?.swiper.on("slideChange", (swiper: unknown) => {
        if (!lightningList[(swiper as Swiper).activeIndex]) return;
        const { latitude, longitude } = lightningList[(swiper as Swiper).activeIndex]!;
        panToCenter({ latitude, longitude });
      });
    }
  }, [lightningList]);
};
