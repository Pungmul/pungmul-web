"use client";
import { useState } from "react";
import type { LightningMeeting, UserParticipationData } from "../types";
import { useLightningMap } from "./useLightningMap";
import { useLightningList } from "./useLightningList";
import { useLightningBottomSheet } from "./useLightningBottomSheet";
import { LocationType } from "@pThunder/features/location";

interface UseLightningPageStateProps {
  wholeLightningList: LightningMeeting[];
  schoolLightningList: LightningMeeting[];
  currentLocation: LocationType;
  serverUserLocation: LocationType | undefined;
  userParticipationData: UserParticipationData | undefined;
  updateLocation: (location: LocationType) => void;
}

export const useLightningPageState = (props: UseLightningPageStateProps) => {
  // 각각의 상태 hook 사용
  const mapState = useLightningMap({
    currentLocation: props.currentLocation,
    serverUserLocation: props.serverUserLocation,
    updateLocation: props.updateLocation,
  });
  
  const listState = useLightningList({
    wholeLightningList: props.wholeLightningList,
    schoolLightningList: props.schoolLightningList,
  });
  
  const bottomSheetState = useLightningBottomSheet({
    mapRef: mapState.mapRef as React.RefObject<kakao.maps.Map | null>,
  });
  
  // UI 상태만 관리
  const [waitingView, setWaitingView] = useState(true);
  
  return {
    // Map State
    ...mapState,
    
    // List State
    ...listState,
    
    // BottomSheet State
    ...bottomSheetState,
    
    // UI State
    waitingView,
    setWaitingView,
  };
};
