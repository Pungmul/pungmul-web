"use client";
import { useMemo, useState } from "react";
import type { LightningMeeting } from "../types";
import { filterLightningList } from "../services";

interface UseLightningListProps {
  wholeLightningList: LightningMeeting[];
  schoolLightningList: LightningMeeting[];
}

export const useLightningList = ({
  wholeLightningList,
  schoolLightningList,
}: UseLightningListProps) => {
  // 리스트 관련 상태만 관리
  const [target, setTarget] = useState<"전체" | "우리학교">("전체");

  // 계산된 값들
  const lightningList = useMemo(
    () => filterLightningList(target, wholeLightningList, schoolLightningList),
    [target, wholeLightningList, schoolLightningList]
  );

  return {
    target,
    setTarget,
    lightningList,
  };
};
