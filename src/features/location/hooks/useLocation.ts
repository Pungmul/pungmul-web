"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { locationStore } from "@/store/location/locationStore";
import { getUserLocation } from "../api/locationApi";

// React Query 키
export const locationKeys = {
  all: ["location"] as const,
  user: () => [...locationKeys.all, "user"] as const,
};

// 서버 상태 관리 (React Query)
export const useUserLocation = () => {
  return useSuspenseQuery({
    queryKey: locationKeys.user(),
    queryFn: getUserLocation,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60,
  });
};

// 위치 업데이트 프로미스
export const updateLocation = new Promise(async (resolve, reject) => {
  try {
    const currentLocation = locationStore.getState().currentLocation;
    const getCurrentPosition = locationStore.getState().getCurrentPosition;

    let patchPosition = currentLocation;
    if (!currentLocation) {
      const position = await getCurrentPosition();
      if (!position) {
        reject(new Error("위치 정보를 가져올 수 없습니다."));
        return;
      }
      patchPosition = position;
    }

    if (!patchPosition) {
      reject(new Error("위치 정보를 가져오는데 실패했습니다."));
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_URL}/location/api`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: patchPosition.latitude,
          longitude: patchPosition.longitude,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("위치 업데이트에 실패했습니다.");
    }

    const result = await response.json();
    resolve(result);
  } catch (error) {
    reject(error);
  }
});
