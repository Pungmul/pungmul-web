"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { SwiperRef } from "swiper/react";
import { AnimatePresence } from "framer-motion";
import { LightningOverlay } from "./CreateLightningOverlay";
import { LightningModal } from "./CreateLightningModal";
import { LightningInformation } from "./LightningInformation";
import { LightningMeeting } from "@/shared/types/lightning/type";
import {
  useUserParticipationStatus,
  useUserLocation,
  useUpdateUserLocation,
} from "@/features/lightning/api";
import { useLightningSocket } from "../../hooks/useLightning";
import { participatingLightningStore } from "../../store/participatingLightning";
import { lightningMapStore } from "../../store/lightningMapStore";
import { Responsive } from "@/shared/components/Responsive";
import { Spinner } from "@/shared/components";
import { LightningList } from "./LightningList";
import { LightningMap } from "./LightningMap";
import "@/app/globals.css";
import "swiper/css";
import "swiper/css/pagination";

type LocationType = {
  latitude: number;
  longitude: number;
};

export default function LightningPage() {
  const { wholeLightningList, schoolLightningList } = useLightningSocket();
  
  // TanStack Query 훅들
  const {
    data: userParticipationData,
    isLoading: isParticipationLoading,
  } = useUserParticipationStatus();
  const { participatingLightning } = participatingLightningStore();
  const { data: serverUserLocation } = useUserLocation();
  const { mutate: updateLocation } = useUpdateUserLocation();

  // 로컬 상태
  const [currentLocation, setLocation] = useState<LocationType>();
  const [userPartinLightning, setUserPartinLightning] = useState<
    | (LightningMeeting & {
        isOrganizer: boolean;
        participationStatus: boolean;
        chatRoomUUID: string | null;
      })
    | null
  >(null);
  const [waitingView, setWaitingView] = useState(true);
  const [isLoading, setLoading] = useState(true);

  const isFirst = useRef(true);
  const swiperRef = useRef<SwiperRef>(null);

  // Zustand 스토어
  const { 
    setLightningList, 
    target, 
    focusedLightningIndex 
  } = lightningMapStore();

  // Lightning 목록 업데이트
  useEffect(() => {
    const newList = target === "전체" ? wholeLightningList : schoolLightningList;
    setLightningList(newList);
  }, [target, wholeLightningList, schoolLightningList, setLightningList]);

  // TanStack Query 데이터를 기존 상태에 동기화
  useEffect(() => {
    if (userParticipationData) {
      setUserPartinLightning({
        ...userParticipationData.lightningMeeting,
        isOrganizer: userParticipationData.isOrganizer,
        participationStatus: userParticipationData.participant,
        chatRoomUUID: userParticipationData.chatRoomUUID,
      });
    }
  }, [userParticipationData]);

  // 위치 업데이트 로직
  useEffect(() => {
    if (currentLocation && serverUserLocation) {
      if (
        !serverUserLocation ||
        serverUserLocation.latitude == null ||
        serverUserLocation.longitude == null
      ) {
        updateLocation({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });
      }
    }
  }, [currentLocation, serverUserLocation, updateLocation]);

  // 포커스된 lightning이 변경되면 스와이퍼 이동
  useEffect(() => {
    if (focusedLightningIndex !== null && swiperRef.current) {
      swiperRef.current.swiper.slideTo(focusedLightningIndex);
    }
  }, [focusedLightningIndex]);

  const handleLocationUpdate = (location: LocationType) => {
    setLocation(location);
    setLoading(false);
  };

  return (
    <AnimatePresence mode="sync" key={"main-animate-presence"}>
      <section
        key="main-div"
        className="relative w-full h-full flex-grow flex flex-col justify-end lg:flex-row-reverse"
      >
        {(isLoading || isParticipationLoading) && !participatingLightning && (
          <div className="absolute z-20 bg-black bg-opacity-40 text-white w-full h-full flex flex-col items-center justify-center">
            <Spinner/>
          </div>
        )}
        
        <LightningInformation
          userPartinLightning={userPartinLightning}
          waitingView={waitingView}
          isFirst={isFirst}
          setWaitingView={setWaitingView}
        />
        
        <LightningMap
          currentLocation={currentLocation}
          onLocationUpdate={handleLocationUpdate}
        />

        <LightningList
          ref={swiperRef}
          userPartinLightning={userPartinLightning}
        />
      </section>
      
      <Responsive
        mobile={
          userPartinLightning &&
          !userPartinLightning.participationStatus && (
            <Suspense fallback={<div>로딩중...</div>}>
              <LightningOverlay />
            </Suspense>
          )
        }
        desktop={
          userPartinLightning &&
          !userPartinLightning.participationStatus && (
            <Suspense fallback={<div>로딩중...</div>}>
              <LightningModal />
            </Suspense>
          )
        }
      />
    </AnimatePresence>
  );
} 