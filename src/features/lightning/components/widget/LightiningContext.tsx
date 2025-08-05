"use client";
import { useLightningCreateStore } from "../../store/lightningCreateStore";

// 기존 훅을 Zustand 스토어로 대체
export const useLightningCreate = () => {
  return useLightningCreateStore();
};
