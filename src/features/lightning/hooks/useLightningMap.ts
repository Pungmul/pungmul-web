"use client";
import { locationStore, LocationType } from "@/features/location";
import { useEffect, useRef, useState } from "react";

interface UseLightningMapProps {
  currentLocation: LocationType | null;
  serverUserLocation: LocationType | undefined;
  updateLocation: (location: LocationType) => void;
}

export const useLightningMap = ({
  currentLocation,
  serverUserLocation,
  updateLocation,
}: UseLightningMapProps) => {
  // 맵 관련 상태만 관리
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const setCurrentLocation = locationStore().setCurrentLocation;
  const getCurrentPosition = locationStore().getCurrentPosition;
  // Refs
  const isFirst = useRef(true);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const GPSmarkerRef = useRef<kakao.maps.Marker|null>(null);
  const markersRef = useRef<
    { marker: kakao.maps.Marker; circle: kakao.maps.Circle }[]
  >([]);

  // 위치 업데이트 로직
  useEffect(() => {
    if (!currentLocation) {
      getCurrentPosition().then((position) => {
        if (!position) {
          return;
        }
        setCurrentLocation(position);
      });
    }
    if (
      currentLocation &&
      serverUserLocation &&
      serverUserLocation.latitude &&
      serverUserLocation.longitude
    ) {
      // 서버에 저장된 위치가 없거나 현재 위치와 다른 경우 업데이트
      if (
        !serverUserLocation ||
        serverUserLocation.latitude !== currentLocation.latitude ||
        serverUserLocation.longitude !== currentLocation.longitude
      ) {
        updateLocation({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });
      }
    }
  }, [currentLocation, serverUserLocation, updateLocation]);

  return {
    isLocationLoaded,
    setIsLocationLoaded,
    isFirst,
    mapRef,
    GPSmarkerRef,
    markersRef,
  };
};
