"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

// Shared Components
import { Responsive, MapContainer, Spinner } from "@/shared";
import { GPSOutline } from "@/shared/components/Icons";

// Hooks
import {
  useLightningSocket,
  useUserLocation,
  useUpdateUserLocation,
  useLightningMapControls,
  useLightningMarkers,
} from "@/features/lightning";
import { useLightningMap } from "@/features/lightning/hooks/useLightningMap";
import { useLightningList } from "@/features/lightning/hooks/useLightningList";
import { useLightningBottomSheet } from "@/features/lightning/hooks/useLightningBottomSheet";

// Functions & Components from lightning feature
import {
  LightningInformation,
  LightningBottomSheet,
  LightningSidebar,
} from "@/features/lightning";
// Stores
import { locationStore } from "@/features/location/store";

// Styles
import "@/app/globals.css";
import "swiper/css";
import "swiper/css/pagination";
import { LightningCreateFormContainer } from "@/features/lightning/components/widget/LightningCreateFormContainer";

export default function LightningPage() {
  const currentLocation = locationStore((state) => state.currentLocation);
  const {
    myInfo,
    userParticipationData,
    wholeLightningList,
    schoolLightningList,
  } = useLightningSocket();
  // TanStack Query 훅들 사용
  const { data: serverUserLocation } = useUserLocation();
  const { mutate: updateLocation } = useUpdateUserLocation();

  // UI 상태
  const [waitingView, setWaitingView] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  // 분리된 상태 관리 hooks
  const mapState = useLightningMap({
    currentLocation,
    serverUserLocation,
    updateLocation,
  });

  const listState = useLightningList({
    wholeLightningList,
    schoolLightningList,
  });

  const bottomSheetState = useLightningBottomSheet({
    mapRef: mapState.mapRef,
  });

  // 맵 컨트롤
  const mapControls = useLightningMapControls({
    mapRef: mapState.mapRef,
    GPSmarkerRef: mapState.GPSmarkerRef,
    bottomSheetRef: bottomSheetState.bottomSheetRef,
    currentLocation,
    isMapReady: isMapReady,
    setIsLocationLoaded: mapState.setIsLocationLoaded,
  });

  // 마커 관리
  useLightningMarkers({
    mapRef: mapState.mapRef,
    markersRef: mapState.markersRef,
    lightningList: listState.lightningList,
    panToCenter: mapControls.panToCenter,
    swiperRef: bottomSheetState.swiperRef,
    target: listState.target,
  });

  // if (!myInfo) {
  //   return null;
  // }

  return (
    <AnimatePresence mode="sync" key={"main-animate-presence"}>
      <main
        key="main-div"
        className="relative w-full h-full flex-grow flex flex-col justify-end md:flex-row-reverse overflow-hidden"
      >
        <LightningInformation
          userPartinLightning={userParticipationData}
          waitingView={waitingView}
          isFirst={mapState.isFirst}
          setWaitingView={setWaitingView}
        />
        <section className="flex-grow w-full h-full relative md:-left-[8px]">
          <MapContainer
            mapRef={mapState.mapRef}
            className="w-[calc(100%+8px)] h-full"
            initialLocation={currentLocation}
            setIsMapReady={setIsMapReady}
          >
            {!(mapState.isLocationLoaded && isMapReady) && (
              <div className="absolute w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-10">
                <Spinner
                  size={32}
                  baseColor="transparent"
                  highlightColor="#FFFFFF"
                />
              </div>
            )}
            {currentLocation && (
              <div
                className="hidden md:flex absolute w-[48px] h-[48px] items-center justify-center cursor-pointer shadow-lg z-10 rounded-full bottom-[16px] bg-background right-[16px]"
                onClick={mapControls.panToCurrentLocation}
              >
                <GPSOutline className="size-[24px] text-grey-700" />
              </div>
            )}
          </MapContainer>
        </section>
        <Responsive
          mobile={
            <LightningBottomSheet
              ref={bottomSheetState.bottomSheetRef}
              myInfo={myInfo!}
              target={listState.target}
              setTarget={listState.setTarget}
              swiperRef={bottomSheetState.swiperRef}
              lightningList={listState.lightningList}
              userPartinLightning={userParticipationData}
              panToMyLocation={mapControls.panToCurrentLocation}
            />
          }
          desktop={
            <LightningSidebar
              myInfo={myInfo!}
              target={listState.target}
              setTarget={listState.setTarget}
              swiperRef={bottomSheetState.swiperRef}
              lightningList={listState.lightningList}
              userPartinLightning={userParticipationData}
            />
          }
        />
      </main>
      <LightningCreateFormContainer />
    </AnimatePresence>
  );
}
