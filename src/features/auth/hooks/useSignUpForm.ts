"use client";

import { useState, useCallback } from "react";

import { FullSignUpFormData } from "../types/sign-up.schemas";
import { SignUpStep } from "../types/sign-up.types";

export const useSignUpForm = () => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("약관동의");
  // React Hook Form 설정
  const [data, setData] = useState<FullSignUpFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
    club: undefined,
    clubAge: "",
    tellNumber: "",
    inviteCode: "",
  });

  // 다음 스텝으로 이동
  const onNextStep = () => {
    const stepOrder: SignUpStep[] = [
      "약관동의",
      "계정정보입력",
      "개인정보입력",
      "완료",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];

      if (nextStep) {
        setCurrentStep(nextStep);
      }
    }
  };

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
