"use client";

import { TermsStep } from "./TermsStep";
import { AccountStep } from "./AccountStep";
import { PersonalStep } from "./PersonalStep";
import { CompleteStep } from "./CompleteStep";
import { useSignUpForm } from "../../hooks/useSignUpForm";
import { SignUpStep } from "../../types/sign-up.types";
import { match } from "ts-pattern";
import { StepIndicator } from "./SignUpStepIndicator";
import { PersonalFormData } from "../../types";

export const SignUpForm = () => {
  const {
    currentStep,
    handleTermsSubmit,
    handleAccountSubmit,
    handlePersonalSubmit,
    submitFinalSignUp,
    isPending,
    error,
  } = useSignUpForm();

  return (
    <div className="h-full w-full flex flex-col justify-center">
      <div className="flex flex-col flex-grow flex-shrink-0">
        <StepIndicator currentStep={currentStep} />

        <SignUpStepForms
          currentStep={currentStep}
          handleTermsSubmit={handleTermsSubmit}
          handleAccountSubmit={handleAccountSubmit}
          handlePersonalSubmit={handlePersonalSubmit}
          submitFinalSignUp={submitFinalSignUp}
          isPending={isPending}
          error={error}
        />
      </div>
    </div>
  );
};

function SignUpStepForms({
  currentStep,
  handleTermsSubmit,
  handleAccountSubmit,
  handlePersonalSubmit,
  submitFinalSignUp,
  isPending,
  error,
}: {
  currentStep: SignUpStep;
  handleTermsSubmit: (data: {
    usingTermAgree: boolean;
    personalInfoAgree: boolean;
  }) => void;
  handleAccountSubmit: (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  handlePersonalSubmit: (data: PersonalFormData) => void;
  submitFinalSignUp: () => Promise<void>;
  isPending: boolean;
  error: Error | null;
}) {
  return match(currentStep)
    .with("약관동의", () => <TermsStep onSubmit={handleTermsSubmit} />)
    .with("계정정보입력", () => <AccountStep onSubmit={handleAccountSubmit} />)
    .with("개인정보입력", () => (
      <PersonalStep onSubmit={handlePersonalSubmit} />
    ))
    .with("완료", () => (
      <CompleteStep
        submitFinalSignUp={submitFinalSignUp}
        isPending={isPending}
        error={error}
      />
    ))
    .exhaustive();
}
