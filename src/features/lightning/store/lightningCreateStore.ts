import { create } from "zustand";

import {
  getNowTimeString,
  addMinutesToTime,
  subMinutesFromTime,
} from "@/shared/lib/dayjs";

import { LightningCreateFormData } from "../types/lightningCreate.schemas";

interface LightningCreateState {
  // 폼 데이터
  formData: LightningCreateFormData;

  // UI 상태
  isSubmitting: boolean;

  // 액션들
  setFormData: (formData: LightningCreateFormData) => void;
  updateField: <K extends keyof LightningCreateFormData>(
    field: K,
    value: LightningCreateFormData[K],
  ) => void;

  setIsSubmitting: (isSubmitting: boolean) => void;

  // 파생 상태 (Derived State)
  getMinStartTime: () => string;
  getMaxStartTime: () => string;
  getMinEndTime: () => string;

  // 초기화
  reset: () => void;
}

const initialFormData: LightningCreateFormData = {
  title: "",
  minPersonnel: 4,
  maxPersonnel: 6,
  lightningType: "일반 모임",
  recruitEndTime: "",
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

export const useLightningCreateStore = create<LightningCreateState>()(
  (set, get) => ({
    ...initialState,

    // 폼 데이터 관리
    setFormData: (formData) => set({ formData }),

    updateField: (field, value) =>
      set((state) => ({
        formData: { ...state.formData, [field]: value },
      })),

    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

    // 파생 상태 (Derived State)
    getMinStartTime: () => {
      return getNowTimeString();
    },

    getMaxStartTime: () => {
      const { formData } = get();
      return formData.endTime
        ? subMinutesFromTime(formData.endTime, 30)
        : "23:59";
    },

    getMinEndTime: () => {
      const { formData } = get();
      return formData.startTime ? addMinutesToTime(formData.startTime, 30) : "";
    },

    // 초기화
    reset: () => set(initialState),
  }),
);
