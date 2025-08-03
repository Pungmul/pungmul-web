import { createStore } from 'zustand';
import { SignUpStep, StoredFormData } from '../types/sign-up.types';

export interface SignUpState {
  // 스텝 관리
  currentStep: SignUpStep;
  setCurrentStep: (step: SignUpStep) => void;
  
  // 로컬 스토리지 관련
  getStoredFormData: () => StoredFormData;
  saveFormData: (data: Partial<StoredFormData>) => void;
  clearStoredData: () => void;
  
  // 스텝 네비게이션
  goToNextStep: () => void;
  goToPrevStep: () => void;
}

const STORAGE_KEY = 'signUpFormData';

export const useSignUpStore = createStore<SignUpState>((set, get) => ({
  // 초기 상태
  currentStep: '약관동의',
  
  setCurrentStep: (step: SignUpStep) => set({ currentStep: step }),

  // 로컬 스토리지에서 데이터 불러오기
  getStoredFormData: (): StoredFormData => {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('로컬 스토리지 데이터 로드 실패:', error);
      return {};
    }
  },

  // 로컬 스토리지에 데이터 저장
  saveFormData: (data: Partial<StoredFormData>) => {
    if (typeof window === 'undefined') return;
    
    try {
      const current = get().getStoredFormData();
      const updated = { ...current, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('로컬 스토리지 데이터 저장 실패:', error);
    }
  },

  // 저장된 데이터 삭제
  clearStoredData: () => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('로컬 스토리지 데이터 삭제 실패:', error);
    }
  },

  // 다음 스텝으로 이동
  goToNextStep: () => {
    const { currentStep } = get();
    const stepOrder: SignUpStep[] = ['약관동의', '계정정보입력', '개인정보입력'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      set({ currentStep: stepOrder[currentIndex + 1] as SignUpStep });
    }
  },

  // 이전 스텝으로 이동
  goToPrevStep: () => {
    const { currentStep } = get();
    const stepOrder: SignUpStep[] = ['약관동의', '계정정보입력', '개인정보입력'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex > 0) {
      set({ currentStep: stepOrder[currentIndex - 1] as SignUpStep });
    }
  },
}));

export default useSignUpStore; 