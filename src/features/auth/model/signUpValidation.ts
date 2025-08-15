import { UseFormReturn } from "react-hook-form";
import { FullSignUpFormData } from "../types/sign-up.schemas";
import { SignUpStep } from "../types/sign-up.types";

export const getStepValidationFields = (step: SignUpStep): (keyof FullSignUpFormData)[] => {
  switch (step) {
    case "약관동의":
      return [];
    case "계정정보입력":
      return ["email", "password", "confirmPassword"];
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
    case "계정정보입력":
      return !!(values.email && values.password && values.confirmPassword);
    case "개인정보입력":
      return !!(values.name && values.tellNumber && values.inviteCode);
    default:
      return false;
  }
};

export const validateStep = async (
  step: SignUpStep,
  form: UseFormReturn<FullSignUpFormData>,
  usingTermAgree?: boolean,
  personalInfoAgree?: boolean
): Promise<boolean> => {
  switch (step) {
    case "약관동의":
      if (!usingTermAgree || !personalInfoAgree) {
        return false;
      }
      return true;

    case "계정정보입력":
    case "개인정보입력":
      const fieldsToValidate = getStepValidationFields(step);
      return await form.trigger(fieldsToValidate);

    default:
      return false;
  }
};
