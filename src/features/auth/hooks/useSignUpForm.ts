"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { fullSignUpSchema, FullSignUpFormData } from "../types/sign-up.schemas";
import { useSignUpRequest } from "../api/signUpApi";
import { SignUpStep } from "../types/sign-up.types";
import { mapClubToClubId } from "@/shared/types/club/constant";

export const useSignUpForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignUpStep>("약관동의");

  const [usingTermAgree, setUsingTermAgree] = useState(false);
  const [personalInfoAgree, setPersonalInfoAgree] = useState(false);

  // React Hook Form 설정
  const form = useForm<FullSignUpFormData>({
    resolver: zodResolver(fullSignUpSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      nickname: "",
      club: undefined,
      tellNumber: "",
      inviteCode: "",
    },
  });

  // API mutation
  const {
    mutate: submitSignUp,
    isPending,
    error,
  } = useSignUpRequest({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
    },
  });

  // 전화번호 포맷팅 헬퍼
  const formatPhoneNumber = useCallback((value: string): string => {
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length <= 3) return numericValue;
    if (numericValue.length <= 7)
      return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
    if (numericValue.length <= 10)
      return `${numericValue.slice(0, 3)}-${numericValue.slice(
        3,
        6
      )}-${numericValue.slice(6)}`;
    if (numericValue.length <= 11)
      return `${numericValue.slice(0, 3)}-${numericValue.slice(
        3,
        7
      )}-${numericValue.slice(7)}`;
    return `${numericValue.slice(0, 11)}`;
  }, []);

  // 전화번호 자동 포맷팅
  useEffect(() => {
    const subscription = form.watch((data, { name }) => {
      if (name === "tellNumber" && data.tellNumber) {
        const formattedValue = formatPhoneNumber(data.tellNumber);
        if (formattedValue !== data.tellNumber) {
          form.setValue("tellNumber", formattedValue, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, formatPhoneNumber]);
  // 다음 스텝으로 이동
  const goToNextStep = () => {
    const stepOrder: SignUpStep[] = [
      "약관동의",
      "계정정보입력",
      "개인정보입력",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex < stepOrder.length - 1) {
      
      const nextStep = stepOrder[currentIndex + 1];

      if (nextStep) {
        setCurrentStep(nextStep);
      }
    }
  };

  // 현재 스텝이 유효한지 체크
  const isCurrentStepValid = (): boolean => {
    const values = form.getValues();

    switch (currentStep) {
      case "약관동의":
        return usingTermAgree && personalInfoAgree;
      case "계정정보입력":
        return !!(values.email && values.password && values.confirmPassword);
      case "개인정보입력":
        return !!(values.name && values.tellNumber && values.inviteCode);
      default:
        return false;
    }
  };

  // 다음 스텝 또는 제출 처리
  const handleNextStep = async () => {
    let fieldsToValidate: (keyof FullSignUpFormData)[] = [];

    switch (currentStep) {
      case "약관동의":
        break;
      case "계정정보입력":
        fieldsToValidate = ["email", "password", "confirmPassword"];
        break;
      case "개인정보입력":
        fieldsToValidate = ["name", "tellNumber", "inviteCode"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (!isValid) {
      return false;
    }

    if (currentStep === "개인정보입력") {
      // 최종 제출 - FormData 생성
      const values = form.getValues();

      const accountData = {
        username: values.email,
        password: values.password,
        name: values.name,
        clubName: values.nickname || "", // 빈 문자열로 안전하게 처리
        clubId: values.club ? mapClubToClubId(values.club) : null, // null로 안전하게 처리 
        phoneNumber: values.tellNumber.replace(/-/g, ""),
        invitationCode: values.inviteCode,
      };

      submitSignUp(accountData);
    } else {
      goToNextStep();
    }

    return true;
  };

  return {
    // Form 관련
    ...form,

    // 약관동의 상태
    usingTermAgree,
    setUsingTermAgree,
    personalInfoAgree,
    setPersonalInfoAgree,

    // 상태
    currentStep,
    setCurrentStep,
    isPending,
    error,

    // 검증 & 액션
    isCurrentStepValid,
    handleNextStep,

    // 헬퍼
    formatPhoneNumber,
  };
};
