"use client";
import { useRef } from "react";
import type { LightningBottomSheetRefType } from "../types";
import { SwiperRef } from "swiper/react";
import { useKakaoMapsEffect } from "@pThunder/shared/hooks";

interface UseLightningBottomSheetProps {
  mapRef: React.RefObject<kakao.maps.Map | null>;
}

export const useLightningBottomSheet = ({ mapRef }: UseLightningBottomSheetProps) => {
  // BottomSheet 관련 상태만 관리
  const bottomSheetRef = useRef<LightningBottomSheetRefType>(null);
  const swiperRef = useRef<SwiperRef | null>(null);
  
  // Bottom Sheet 이벤트 설정
  useKakaoMapsEffect(() => {
    if (bottomSheetRef.current && mapRef.current) {
      const map = mapRef.current;
      bottomSheetRef.current.onLevelChange((oldLevel: number, newLevel: number) => {
        map.panBy(0, (oldLevel - newLevel) / 2);
      });
    }
  }, []);
  
  return {
    bottomSheetRef,
    swiperRef,
  };
};
