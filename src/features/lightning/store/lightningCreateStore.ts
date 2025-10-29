import { create } from 'zustand';
import dayjs from 'dayjs';
import { CreateLightningMeetingRequest } from '../types';
import { LightningCreateFormData } from '../types/lightningCreate.schemas';
import { updateLocation } from '@pThunder/features/location';
import { Alert } from '@pThunder/shared';

interface LightningCreateState {
  // 폼 데이터
  formData: LightningCreateFormData;
  
  // UI 상태
  isSubmitting: boolean;
  
  // 액션들
  setFormData: (formData: LightningCreateFormData) => void;
  updateField: <K extends keyof LightningCreateFormData>(
    field: K, 
    value: LightningCreateFormData[K]
  ) => void;
  
  setIsSubmitting: (isSubmitting: boolean) => void;
  
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

const initialFormData: LightningCreateFormData = {
  title: "",
  minPersonnel: 4,
  maxPersonnel: 6,
  lightningType: "일반 모임",
  recruitmentPeriod: 5,
  address: "",
  detailAddress: "",
  locationPoint: null,
  target: "전체",
  tagList: [],
  startTime: "",
  endTime: "",
};

const initialState = {
  formData: initialFormData,
  currentStep: 1,
  isSubmitting: false,
};

export const useLightningCreateStore = create<LightningCreateState>()((set, get) => ({
  ...initialState,
  
  // 폼 데이터 관리
  setFormData: (formData) => set({ formData }),
  
  updateField: (field, value) => set((state) => ({
    formData: { ...state.formData, [field]: value }
  })),
  
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  
  // 유틸리티 함수들
  getNowTimeString: () => {
    return dayjs().add(1, "minute").format("HH:mm");
  },
  
  addMinutes: (timeStr: string, minutes: number) => {
    const time = dayjs().format("YYYY-MM-DD") + "T" + timeStr;
    return dayjs(time).add(minutes, "minute").format("HH:mm:ss");
  },
  
  subMinutes: (timeStr: string, minutes: number) => {
    const time = dayjs().format("YYYY-MM-DD") + "T" + timeStr;
    return dayjs(time).subtract(minutes, "minute").format("HH:mm:ss");
  },
  
  getMinStartTime: () => {
    return get().getNowTimeString();
  },
  
  getMaxStartTime: () => {
    const { formData, subMinutes } = get();
    return formData.endTime ? subMinutes(formData.endTime, 30) : "23:59";
  },
  
  getMinEndTime: () => {
    const { formData, addMinutes } = get();
    return formData.startTime ? addMinutes(formData.startTime, 30) : "";
  },
  
  // 생성 함수
  createLightning: async () => {
    const { formData, setIsSubmitting } = get();
    setIsSubmitting(true);
    
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const recruitmentEndTime = get().addMinutes(get().getNowTimeString(), formData.recruitmentPeriod);

      const requestBody: CreateLightningMeetingRequest =
        formData.lightningType === "일반 모임"
          ? {
              meetingName: formData.title,
              startTime: dayjs(today + "T" + formData.startTime).format("YYYY-MM-DDTHH:mm:ss"),
              endTime: dayjs(today + "T" + formData.endTime).format("YYYY-MM-DDTHH:mm:ss"),
              recruitmentEndTime: dayjs(today + "T" + recruitmentEndTime).format("YYYY-MM-DDTHH:mm:ss"),
              minPersonNum: formData.minPersonnel,
              maxPersonNum: formData.maxPersonnel,
              meetingType: "FREE",
              latitude: Number(formData.locationPoint!.latitude),
              longitude: Number(formData.locationPoint!.longitude),
              buildingName: formData.address || "",
              locationDetail: formData.detailAddress || "",
              visibilityScope: formData.target === "전체" ? "ALL" : "SCHOOL_ONLY",
              tags: formData.tagList,
            }
          : {
              meetingName: formData.title,
              startTime: dayjs(today + "T" + formData.startTime).format("YYYY-MM-DDTHH:mm:ss"),
              endTime: dayjs(today + "T" + formData.endTime).format("YYYY-MM-DDTHH:mm:ss"),
              recruitmentEndTime: dayjs(today + "T" + recruitmentEndTime).format("YYYY-MM-DDTHH:mm:ss"),
              minPersonNum: formData.minPersonnel,
              maxPersonNum: formData.maxPersonnel,
              meetingType: "PAN",
              latitude: Number(formData.locationPoint!.latitude),
              longitude: Number(formData.locationPoint!.longitude),
              buildingName: formData.address || "",
              locationDetail: formData.detailAddress || "",
              visibilityScope: formData.target === "전체" ? "ALL" : "SCHOOL_ONLY",
              tags: formData.tagList,
            };


      await updateLocation();

      const response = await fetch(`/api/lightning/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create lightning");
      }
      
    } catch (error) {
      console.error("Error creating lightning:", error);
      Alert.alert({
        title: "모임 생성 실패",
        message: "모임 생성에 실패했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  },
  
  // 초기화
  reset: () => set(initialState),
}));