"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback, useEffect } from "react";

import { fullSignUpSchema, FullSignUpFormData, PersonalFormData } from "../types/sign-up.schemas";
import { useSignUpRequest } from "../api/signUpApi";
import { SignUpStep } from "../types/sign-up.types";
import { ClubName, mapClubToClubId } from "@/shared/types/club/constant";
import { formatPhoneNumber } from "../lib";
import { validateStep } from "../model";

export const useSignUpForm = () => {
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
    reValidateMode: "onChange",
  });

  // API mutation
  const { mutate: submitSignUp, isPending, error } = useSignUpRequest();
  // 전화번호 자동 포맷팅
  useEffect(() => {
    const subscription = form.watch((data, { name }) => {
      if (name === "tellNumber" && data.tellNumber) {
        const formattedValue = formatPhoneNumber(data.tellNumber) as string;
        if (formattedValue !== data.tellNumber) {
          form.setValue("tellNumber", formattedValue, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);
  // 다음 스텝으로 이동
  const goToNextStep = () => {
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

  const validateCurrentStep = useCallback(async () => {
    const isValid = await validateStep(currentStep, form, usingTermAgree, personalInfoAgree);
    return isValid;
  }, [form, currentStep, usingTermAgree, personalInfoAgree]);

  // 현재 스텝이 유효한지 체크
  const isCurrentStepValid = useCallback(async () => {
    const values = form.getValues();

    switch (currentStep) {
      case "약관동의":
        return true;
      case "계정정보입력":
        if (!!values.email && !!values.password && !!values.confirmPassword) {
          const isValid = await validateCurrentStep();
          return isValid;
        }
        return false;
      case "개인정보입력":
        if (!!values.name && !!values.tellNumber && !!values.inviteCode) {
          const isValid = await validateCurrentStep();
          return isValid;
        }
        return false;
      default:
        return false;
    }
  }, [currentStep, usingTermAgree, personalInfoAgree, form.getValues()]);

  // 각 단계별 핸들러
  const handleTermsSubmit = (data: { usingTermAgree: boolean; personalInfoAgree: boolean }) => {
    setUsingTermAgree(data.usingTermAgree);
    setPersonalInfoAgree(data.personalInfoAgree);
    goToNextStep();
  };

  const handleAccountSubmit = (data: { email: string; password: string; confirmPassword: string }) => {
    form.setValue("email", data.email);
    form.setValue("password", data.password);
    form.setValue("confirmPassword", data.confirmPassword);
    goToNextStep();
  };

  const handlePersonalSubmit = (data: PersonalFormData) => {
    // form에 값 설정
    form.setValue("name", data.name);
    form.setValue("nickname", data.nickname);
    form.setValue("club", data.club as ClubName | null);
    form.setValue("tellNumber", data.tellNumber);
    form.setValue("inviteCode", data.inviteCode);
    goToNextStep();
  };

  // 최종 회원가입 제출 함수
  const submitFinalSignUp = async () => {
    try {
      // 최종 검증 - 전체 form 데이터 검증
      const isFormValid = await form.trigger();
      
      if (!isFormValid) {
        throw new Error("Form validation failed");
      }

      // 최종 제출 - 모든 데이터 결합
      const finalData = {
        username: form.getValues().email,
        password: form.getValues().password,
        name: form.getValues().name,
        clubName: form.getValues().nickname || "",
        clubId: form.getValues().club ? mapClubToClubId(form.getValues().club as any) : null,
        phoneNumber: form.getValues().tellNumber.replace(/-/g, ""),
        invitationCode: form.getValues().inviteCode,
      };

      // API 호출
      submitSignUp(finalData, {
        onSuccess: () => {
          // 성공 시 CompleteStep에서 처리
          console.log("회원가입 성공");
        },
        onError: (error) => {
          console.error("회원가입 실패:", error);
          // 에러 시 이전 단계로 돌아가기
          setCurrentStep("개인정보입력");
        },
      });
      
    } catch (error) {
      console.error("회원가입 검증 실패:", error);
      setCurrentStep("개인정보입력");
    }
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

    // 각 단계별 핸들러
    handleTermsSubmit,
    handleAccountSubmit,
    handlePersonalSubmit,
    submitFinalSignUp,
  };
};
