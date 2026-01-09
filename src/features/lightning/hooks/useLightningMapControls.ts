"use client";
import { useCallback } from "react";
import { useKakaoMapsEffect } from "@/shared/hooks";
import type { LocationType } from "@/features/location";
import { getAdjustedCenter, createGPSMarker } from "../lib";
import { LightningBottomSheetRefType } from "../types";

interface UseLightningMapControlsProps {
  mapRef: React.RefObject<kakao.maps.Map | null>;
  GPSmarkerRef: React.RefObject<kakao.maps.Marker | null>;
  bottomSheetRef: React.RefObject<LightningBottomSheetRefType | null>;
  currentLocation: LocationType | null;
  isMapReady: boolean;
  setIsLocationLoaded: (loaded: boolean) => void;
}

export const useLightningMapControls = ({
  mapRef,
  GPSmarkerRef,
  bottomSheetRef,
  currentLocation,
  isMapReady,
  setIsLocationLoaded,
}: UseLightningMapControlsProps) => {
  const panToCenter = useCallback(
    ({ latitude, longitude }: LocationType) => {
      if (mapRef.current) {
        const targetLatLon = new window.kakao.maps.LatLng(latitude, longitude);

        // 모바일 뷰에서는 bottomSheetRef.current가 존재 -> 분기 처리
        if (bottomSheetRef.current) {
          mapRef.current.panTo(
            getAdjustedCenter(
              mapRef.current,
              targetLatLon,
              bottomSheetRef.current
            )
          );
        } else {
          mapRef.current.panTo(targetLatLon);
        }
      }
    },
    [mapRef, bottomSheetRef]
  );

  const panToCurrentLocation = useCallback(() => {
    if (currentLocation && mapRef.current) {
      panToCenter(currentLocation);
    }
  }, [currentLocation, panToCenter]);

  // GPS 마커 초기화
  useKakaoMapsEffect(() => {
    if (!isMapReady) return;
    if (!mapRef.current) return;
    if (!currentLocation) return;
    if (!GPSmarkerRef.current) {
      mapRef.current.setCenter(
        new window.kakao.maps.LatLng(
          currentLocation.latitude,
          currentLocation.longitude
        )
      );

      const { marker } = createGPSMarker({
        locationPoint: currentLocation,
      });

      GPSmarkerRef.current = marker;
    } else {
      GPSmarkerRef.current.setPosition(
        new window.kakao.maps.LatLng(
          currentLocation.latitude,
          currentLocation.longitude
        )
      );
    }
    
    GPSmarkerRef.current.setMap(mapRef.current);
    setIsLocationLoaded(true);

    if (bottomSheetRef.current && mapRef.current) {
      const map = mapRef.current;
      bottomSheetRef.current.onLevelChange((oldLevel, newLevel) => {
        map.panBy(0, (oldLevel - newLevel) / 2);
      });
    }
  }, [currentLocation, isMapReady]);

  return {
    panToCenter,
    panToCurrentLocation,
  };
};
