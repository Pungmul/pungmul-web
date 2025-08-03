import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FullSignUpFormData } from "./sign-up.schemas";

export type SignUpStep = "약관동의" | "계정정보입력" | "개인정보입력";

export type SignUpStepList ={
  약관동의: TermsStepProps;
  계정정보입력: AccountStepProps;
  개인정보입력: PersonalStepProps;
}

export interface AccountStepProps {
  register: UseFormRegister<FullSignUpFormData>;
  errors: FieldErrors<FullSignUpFormData>;
  watch: unknown;
  setValue: unknown;
}

export interface PersonalStepProps {
  register: UseFormRegister<FullSignUpFormData>;
  errors: FieldErrors<FullSignUpFormData>;
  watch: unknown;
  setValue: unknown;
}

export interface TermsStepProps {
  register: UseFormRegister<FullSignUpFormData>;
  errors: FieldErrors<FullSignUpFormData>;
  watch: unknown;
  setValue: unknown;
}


export interface PersonalInfo {
  name?: string;
  nickname?: string;
  club?: number | null;
  tellNumber?: string;
  inviteCode: string;
}

// 로컬 스토리지 저장용 타입
export interface StoredFormData {
  usingTermAgree?: boolean;
  personalInfoAgree?: boolean;
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  nickname?: string;
  club?: number | null;
  tellNumber?: string;
  inviteCode?: string;
}

// API 요청용 타입
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  nickname?: string;
  club?: number | null;
  tellNumber: string;
  inviteCode: string;
}

export interface SignUpRequestForm {
  username: string;
  password: string;
  name: string;
  clubName?: string;
  clubId?: number | null;
  phoneNumber: string;
  invitationCode: string;
}

// API 응답용 타입
export interface SignUpResponse {
  success: boolean;
  message?: string;
  data?: unknown;
} 