import { createStore } from "zustand";
import { SignUpStep } from "../types/sign-up.types";

export interface SignUpState {
  // 스텝 관리
  currentStep: SignUpStep;
  setCurrentStep: (step: SignUpStep) => void;

  // 스텝 네비게이션
  goToNextStep: () => void;
  goToPrevStep: () => void;
}

export const useSignUpStore = createStore<SignUpState>((set, get) => ({
  // 초기 상태
  currentStep: "약관동의",

  setCurrentStep: (step: SignUpStep) => set({ currentStep: step }),

  // 다음 스텝으로 이동
  goToNextStep: () => {
    const { currentStep } = get();
    const stepOrder: SignUpStep[] = [
      "약관동의",
      "계정정보입력",
      "개인정보입력",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex < stepOrder.length - 1) {
      set({ currentStep: stepOrder[currentIndex + 1] as SignUpStep });
    }
  },

  // 이전 스텝으로 이동
  goToPrevStep: () => {
    const { currentStep } = get();
    const stepOrder: SignUpStep[] = [
      "약관동의",
      "계정정보입력",
      "개인정보입력",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex > 0) {
      set({ currentStep: stepOrder[currentIndex - 1] as SignUpStep });
    }
  },
}));

export default useSignUpStore;
