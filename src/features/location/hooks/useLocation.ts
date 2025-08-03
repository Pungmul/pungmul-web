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
    gcTime: 1000 * 60 ,
  });
};

// 위치 업데이트 뮤테이션
export const updateLocation = (async () => {
  const currentLocation = locationStore.getState().currentLocation;
  const getCurrentPosition = locationStore.getState().getCurrentPosition;

  let patchPostion = currentLocation;
  if (!currentLocation) {
    const position = await getCurrentPosition();
    if (!position) return;
    patchPostion = position;
  }

  if (!patchPostion) throw new Error("위치 정보를 가져오는데 실패했습니다.");

  return await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/location/api`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      latitude: patchPostion.latitude,
      longitude: patchPostion.longitude,
    }),
  });
})();
