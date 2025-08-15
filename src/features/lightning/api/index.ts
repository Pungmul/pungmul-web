import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getQueryClient } from "@/core/config/queryClient";
import { LightningMeeting } from "@/shared/types/lightning/type";

const getUserParticipationStatusAPI = async (): Promise<{
  isOrganizer: boolean;
  participant: boolean;
  lightningMeeting: LightningMeeting;
  chatRoomUUID: string | null;
}> => {
  const response = await fetch(`/lightning/status`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};

const joinLightningMeetingAPI = async (meetingId: number): Promise<void> => {
  const response = await fetch(`/lightning/join`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meetingId }),
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};

const exitLightningMeetingAPI = async ({lightningMeetingId}:{lightningMeetingId: number}) => {
  const response = await fetch(`/lightning/exit`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lightningMeetingId }),
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};

const deleteLightningMeetingAPI = async ({
  lightningMeetingId,
}: {
  lightningMeetingId: number;
}) => {
  const response = await fetch(`/lightning/delete`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meetingId: lightningMeetingId }),
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};

const getUserLocationAPI = async (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  const response = await fetch(`/location/api`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};

const updateUserLocationAPI = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<void> => {
  const response = await fetch(`/location/api`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ latitude, longitude }),
  });

  if (!response.ok) throw new Error("서버 불안정" + response.status);

  return response.json();
};

// ============================================
// Query Keys
// ============================================

export const lightningQueryKeys = {
  all: ["lightning"] as const,
  status: () => [...lightningQueryKeys.all, "status"] as const,
  userLocation: () => ["location", "user"] as const,
  lightningList: () => ["lightning", "list"] as const,
  schoolLightningList: () => ["lightning", "school", "list"] as const,
  wholeLightningList: () => ["lightning", "whole", "list"] as const,
} as const;

// ============================================
// Custom Hooks
// ============================================

/**
 * 사용자 번개 참여 상태를 조회하는 Query Hook
 */
export const useUserParticipationStatus = () => {
  return useQuery({
    queryKey: lightningQueryKeys.status(),
    queryFn: getUserParticipationStatusAPI,
    staleTime: 0,
    retry: 2,
  });
};

/**
 * 사용자 위치를 조회하는 Query Hook
 */
export const useUserLocation = () => {
  return useQuery({
    queryKey: lightningQueryKeys.userLocation(),
    queryFn: getUserLocationAPI,
    staleTime: 1000 * 60 * 10, // 10분
    retry: 2,
  });
};

/**
 * 번개 모임 참여하는 Mutation Hook
 */
export const useJoinLightningMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinLightningMeetingAPI,
    onSuccess: () => {
      // 참여 상태 쿼리 무효화하여 최신 상태로 업데이트
      queryClient.invalidateQueries({
        queryKey: lightningQueryKeys.status(),
      });
      console.log("번개 참여 성공");
    },
    onError: (error) => {
      console.error("번개 참여 중 에러:", error);
    },
  });
};

/**
 * 번개 모임 탈퇴하는 Mutation Hook
 */
export const useExitLightningMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exitLightningMeetingAPI,
    onSuccess: (data) => {
      // 참여 상태 쿼리 무효화하여 최신 상태로 업데이트
      queryClient.invalidateQueries({
        queryKey: lightningQueryKeys.status(),
      });
      console.log("번개 탈퇴 성공:", data);
    },
    onError: (error) => {
      console.error("번개 탈퇴 중 에러:", error);
    },
  });
};

/**
 * 번개 모임 삭제하는 Mutation Hook
 */
export const useDeleteLightningMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLightningMeetingAPI,
    onSuccess: (data) => {
      // 참여 상태 쿼리 무효화하여 최신 상태로 업데이트
      queryClient.invalidateQueries({
        queryKey: lightningQueryKeys.status(),
      });
      console.log("번개 삭제 성공:", data);
    },
    onError: (error) => {
      console.error("번개 삭제 중 에러:", error);
    },
  });
};

/**
 * 사용자 위치 업데이트하는 Mutation Hook
 */
export const useUpdateUserLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserLocationAPI,
    onSuccess: () => {
      // 사용자 위치 쿼리 무효화하여 최신 위치로 업데이트
      queryClient.invalidateQueries({
        queryKey: lightningQueryKeys.userLocation(),
      });
      console.log("사용자 위치 업데이트 성공");
    },
    onError: (error) => {
      console.error("사용자 위치 업데이트 중 에러:", error);
    },
  });
};

export const invalidateLightningQueries = () => {
  const queryClient = getQueryClient();

  // 특정 쿼리 무효화 (번개 참여 상태)
  queryClient.invalidateQueries({
    queryKey: [lightningQueryKeys.status(), lightningQueryKeys.userLocation()],
  });
};
// ============================================
// 하위 호환성을 위한 Legacy 함수들 (Deprecated)
// ============================================

/**
 * @deprecated useUserParticipationStatus 훅을 사용하세요
 */
export const getUserParticipationStatus = getUserParticipationStatusAPI;

/**
 * @deprecated useJoinLightningMeeting 훅을 사용하세요
 */
export const joinLightningMeeting = joinLightningMeetingAPI;

/**
 * @deprecated useExitLightningMeeting 훅을 사용하세요
 */
export const exitLightningMeeting = exitLightningMeetingAPI;

/**
 * @deprecated useDeleteLightningMeeting 훅을 사용하세요
 */
export const deleteLightningMeeting = deleteLightningMeetingAPI;

/**
 * @deprecated useUserLocation 훅을 사용하세요
 */
export const getUserLocation = getUserLocationAPI;

/**
 * @deprecated useUpdateUserLocation 훅을 사용하세요
 */
export const updateUserLocation = (latitude: number, longitude: number) =>
  updateUserLocationAPI({ latitude, longitude });

export * from "./api";