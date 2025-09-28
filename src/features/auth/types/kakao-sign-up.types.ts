import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FullSignUpFormData } from "./sign-up.schemas";

export type SignUpStep = "약관동의" | "개인정보입력" | "완료";

export type SignUpStepList ={
  약관동의: TermsStepProps;
  개인정보입력: PersonalStepProps;
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

// API 요청용 타입
export interface SignUpRequest {
  name: string;
  nickname?: string;
  club?: number | null;
  tellNumber: string;
  inviteCode: string;
}

export interface SignUpRequestForm {
  name: string;
  clubName?: string;
  clubId?: number | null;
  phoneNumber: string;
  clubAge: number;
  invitationCode: string;
}

// API 응답용 타입
export interface SignUpResponse {
  success: boolean;
  message?: string;
  data?: unknown;
} 