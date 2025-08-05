import { create } from 'zustand';
import dayjs from 'dayjs';
import { CreateLightningMeetingRequest } from '../model/index';
import { participatingLightningStore } from './participatingLightning';

interface LightningCreateState {
  // 기본 정보
  title: string;
  minPersonnel: number;
  maxPersonnel: number;
  lightningType: "일반 모임" | "풍물 모임";
  recruitmentPeriod: number;
  
  // 위치 정보
  address: string | null;
  detailAddress: string | null;
  locationPoint: { lat: number; lng: number } | null;
  
  // 설정
  target: "우리 학교만" | "전체";
  isAddressModalOpen: boolean;
  isDetailAddressModalOpen: boolean;
  
  // 태그 및 시간
  tagList: string[];
  startTime: string;
  endTime: string;
  
  // 계산된 값들
  minStartTime: string;
  maxStartTime: string;
  minEndTime: string;
  
  // 액션들
  setTitle: (title: string) => void;
  setMinPersonnel: (minPersonnel: number) => void;
  setMaxPersonnel: (maxPersonnel: number) => void;
  setLightningType: (lightningType: "일반 모임" | "풍물 모임") => void;
  setRecruitmentPeriod: (recruitmentPeriod: number) => void;
  setAddress: (address: string | null) => void;
  setDetailAddress: (detailAddress: string | null) => void;
  setLocationPoint: (locationPoint: { lat: number; lng: number } | null) => void;
  setTarget: (target: "우리 학교만" | "전체") => void;
  setIsAddressModalOpen: (isOpen: boolean) => void;
  setIsDetailAddressModalOpen: (isOpen: boolean) => void;
  setTagList: (tagList: string[]) => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
  
  // 유틸리티 함수들
  getNowTimeString: () => string;
  addMinutes: (timeStr: string, minutes: number) => string;
  subMinutes: (timeStr: string, minutes: number) => string;
  getMinStartTime: () => string;
  getMaxStartTime: () => string;
  getMinEndTime: () => string;
  
  // 생성 함수
  createLightning: () => Promise<void>;
  
  // 초기화
  reset: () => void;
}

const initialState = {
  title: "",
  minPersonnel: 4,
  maxPersonnel: 5,
  lightningType: "일반 모임" as const,
  recruitmentPeriod: 5,
  address: null,
  detailAddress: null,
  locationPoint: null,
  target: "전체" as const,
  isAddressModalOpen: false,
  isDetailAddressModalOpen: false,
  tagList: [],
  startTime: "",
  endTime: "",
};

export const useLightningCreateStore = create<LightningCreateState>((set, get) => ({
  ...initialState,
  
  // Setters
  setTitle: (title) => set({ title }),
  setMinPersonnel: (minPersonnel) => set({ minPersonnel }),
  setMaxPersonnel: (maxPersonnel) => set({ maxPersonnel }),
  setLightningType: (lightningType) => set({ lightningType }),
  setRecruitmentPeriod: (recruitmentPeriod) => set({ recruitmentPeriod }),
  setAddress: (address) => set({ address }),
  setDetailAddress: (detailAddress) => set({ detailAddress }),
  setLocationPoint: (locationPoint) => set({ locationPoint }),
  setTarget: (target) => set({ target }),
  setIsAddressModalOpen: (isAddressModalOpen) => set({ isAddressModalOpen }),
  setIsDetailAddressModalOpen: (isDetailAddressModalOpen) => set({ isDetailAddressModalOpen }),
  setTagList: (tagList) => set({ tagList }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),
  
  // 유틸리티 함수들
  getNowTimeString: () => {
    return dayjs().add(1, "minute").format("HH:mm");
  },
  
  addMinutes: (timeStr: string, minutes: number) => {
    const time = dayjs().format("YYYY-MM-DD") + "T" + timeStr;
    return dayjs(time).add(minutes, "minute").format("HH:mm");
  },
  
  subMinutes: (timeStr: string, minutes: number) => {
    const time = dayjs().format("YYYY-MM-DD") + "T" + timeStr;
    return dayjs(time).subtract(minutes, "minute").format("HH:mm");
  },
  
  getMinStartTime: () => {
    return get().getNowTimeString();
  },
  
  getMaxStartTime: () => {
    const { endTime, subMinutes } = get();
    return endTime ? subMinutes(endTime, 30) : "23:59";
  },
  
  getMinEndTime: () => {
    const { startTime, addMinutes } = get();
    return startTime ? addMinutes(startTime, 30) : "";
  },
  
  // 계산된 값들을 상태로 관리
  get minStartTime() {
    return this.getMinStartTime();
  },
  
  get maxStartTime() {
    return this.getMaxStartTime();
  },
  
  get minEndTime() {
    return this.getMinEndTime();
  },
  
  // 생성 함수
  createLightning: async () => {
    const {
      title,
      minPersonnel,
      maxPersonnel,
      lightningType,
      recruitmentPeriod,
      address,
      detailAddress,
      locationPoint,
      target,
      tagList,
      startTime,
      endTime,
      getNowTimeString,
      addMinutes,
    } = get();
    
    const { setParticipatingLightning } = participatingLightningStore.getState();
    
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const recruitmentEndTime = addMinutes(getNowTimeString(), recruitmentPeriod);

      const requestBody: CreateLightningMeetingRequest =
        lightningType === "일반 모임"
          ? {
              meetingName: title,
              startTime: dayjs(today + "T" + startTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              endTime: dayjs(today + "T" + endTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              recruitmentEndTime: dayjs(
                today + "T" + recruitmentEndTime
              ).format("YYYY-MM-DDTHH:mm:ss"),
              minPersonNum: minPersonnel,
              maxPersonNum: maxPersonnel,
              meetingType: "FREE",
              latitude: Number(locationPoint!.lat),
              longitude: Number(locationPoint!.lng),
              buildingName: address || "",
              locationDetail: detailAddress || "",
              visibilityScope: target === "전체" ? "ALL" : "SCHOOL_ONLY",
              tags: tagList,
            }
          : {
              meetingName: title,
              startTime: dayjs(today + "T" + startTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              endTime: dayjs(today + "T" + endTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              recruitmentEndTime: dayjs(
                today + "T" + recruitmentEndTime
              ).format("YYYY-MM-DDTHH:mm:ss"),
              minPersonNum: minPersonnel,
              maxPersonNum: maxPersonnel,
              meetingType: "PAN",
              latitude: Number(locationPoint!.lat),
              longitude: Number(locationPoint!.lng),
              buildingName: address || "",
              locationDetail: detailAddress || "",
              visibilityScope: target === "전체" ? "ALL" : "SCHOOL_ONLY",
              tags: tagList,
            };

      console.log("Request body:", requestBody);
      const response = await fetch(`/lightning/create/api`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to create lightning");
      }
      
      alert("모임 생성에 성공했습니다.");
      const participatingLightning = await response.json();
      setParticipatingLightning(participatingLightning);
      
      // 성공 후 페이지 이동 (router는 컴포넌트에서 처리)
      console.log("모임 생성 성공", response);
      
    } catch (error) {
      console.error("Error creating lightning:", error);
      alert("모임 생성에 실패했습니다.");
    }
  },
  
  // 초기화
  reset: () => set(initialState),
})); 