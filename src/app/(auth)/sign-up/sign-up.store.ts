import { create } from 'zustand';
import { SignUpStep } from './sign-up.types';

interface AuthInfo {
    email: string;
    password: string;
}

interface PersonalInfo {
    name?: string;
    nickname?: string;
    club?: number | null;
    tellNumber?: string;
}

interface SignupState {
    currentStep: SignUpStep;
    setCurrentStep: (step: SignUpStep) => void;
    canNextStep: boolean;
    setCanNextStep: (step: boolean) => void;

    authInfo: AuthInfo;
    setAuthInfo: (info: Partial<AuthInfo>) => void;

    personalInfo: PersonalInfo;
    setPersonalInfo: (info: Partial<PersonalInfo>) => void;

    sendSignUpRequest: () => Promise<void>;
}

const useSignupStore = create<SignupState>((set, get) => ({
    // 단계 관리
    currentStep: '약관동의',
    setCurrentStep: (step: SignUpStep) => set({ currentStep: step }),

    canNextStep: false,
    setCanNextStep: (status: boolean) => set({ canNextStep: status }),

    authInfo: {
        email: '',
        password: ''
    },
    setAuthInfo: (info: Partial<AuthInfo>) => set((state) => ({ authInfo: { ...state.authInfo, ...info } })),

    personalInfo: {
        name: undefined,
        nickname: undefined,
        club: null,
        tellNumber: undefined
    },
    setPersonalInfo: (info: Partial<PersonalInfo>) => set((state) => ({ personalInfo: { ...state.personalInfo, ...info } })),

    sendSignUpRequest: async () => {
        const { authInfo, personalInfo } = get();

        // Validate authInfo
        if (!authInfo.email || !authInfo.password) {
            console.error('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        // Validate personalInfo
        if (!personalInfo.name || !personalInfo.nickname || !personalInfo.tellNumber) {
            console.error('이름, 닉네임, 전화번호를 모두 입력해주세요.');
            return;
        }
        try {
            const response = await fetch('/api/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...personalInfo,
                    email: authInfo.email,
                    password: authInfo.password,
                }),
            });

            if (!response.ok) {
                throw new Error('회원가입 요청에 실패했습니다.');
            }

            const data = await response.json();
            console.log('회원가입 성공:', data);
        } catch (error) {
            console.error('회원가입 오류:', error);
        }
    }
}));

export default useSignupStore;