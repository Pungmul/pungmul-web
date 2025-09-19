import { LocationType } from "@/shared/types/location/type";

// 서버에 위치 업데이트 요청하는 함수
export const updateUserLocation = async (latitude: number, longitude: number) => {
  const response = await fetch("/api/location", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ latitude, longitude }),
  });

  if (!response.ok) {
    throw new Error("Failed to update location");
  }

  return response.json();
};

// 사용자 위치 정보 조회
export const getUserLocation = async (): Promise<LocationType> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/location`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user location");
  }

  return response.json();
}; 