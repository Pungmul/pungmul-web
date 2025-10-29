"use client";
import { Suspense } from "react";
import { Responsive } from "@/shared";
import { LightningOverlay } from "./CreateLightningOverlay";
import { LightningModal } from "./CreateLightningModal";

/**
 * 번개 모달 컨테이너 컴포넌트
 * 모바일/데스크톱에 따라 오버레이 또는 모달을 렌더링합니다.
 */
export const LightningCreateFormContainer = () => {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <Responsive mobile={<LightningOverlay />} desktop={<LightningModal />} />
    </Suspense>
  );
};
