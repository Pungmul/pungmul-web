import { UseFormReturn } from "react-hook-form";
import { FullSignUpFormData } from "../types/kakao-sign-up.schemas";
import { SignUpStep } from "../types/kakao-sign-up.types";

export const getStepValidationFields = (
  step: SignUpStep
): (keyof FullSignUpFormData)[] => {
  switch (step) {
    case "약관동의":
      return [];
    case "개인정보입력":
      return ["name", "tellNumber", "inviteCode"];
    default:
      return [];
  }
};

export const isStepValid = (
  step: SignUpStep,
  values: Partial<FullSignUpFormData>,
  usingTermAgree?: boolean,
  personalInfoAgree?: boolean
): boolean => {
  switch (step) {
    case "약관동의":
      return !!(usingTermAgree && personalInfoAgree);
    case "개인정보입력":
      return !!(values.name && values.tellNumber && values.inviteCode);
    default:
      return false;
  }
};

export const kakaoValidateStep = async (
  step: SignUpStep,
  form: UseFormReturn<FullSignUpFormData>,
): Promise<boolean> => {
  switch (step) {
    case "약관동의":
      return true;
    case "개인정보입력":
      const fieldsToValidate = getStepValidationFields(step);
      return await form.trigger(fieldsToValidate);

    default:
      return false;
  }
};
