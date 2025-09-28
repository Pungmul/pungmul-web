"use client";

import { useCallback, useState } from "react";

import { FullSignUpFormData } from "../types/kakao-sign-up.schemas";
import { SignUpStep } from "../types/kakao-sign-up.types";

export const useSignUpForm = () => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("약관동의");

  const [data, setData] = useState<FullSignUpFormData>({
    name: "",
    nickname: "",
    club: undefined,
    clubAge: "",
    tellNumber: "",
    inviteCode: "",
  });

  const onNextStep = useCallback(() => {
    setCurrentStep(currentStep === "약관동의" ? "개인정보입력" : "완료");
  }, [currentStep]);

  const onSubmit = useCallback((data: Partial<FullSignUpFormData>) => {
    setData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  return {
    // Form 관련
    data,
    onSubmit,
    // 상태
    currentStep,
    onNextStep,
  };
};
