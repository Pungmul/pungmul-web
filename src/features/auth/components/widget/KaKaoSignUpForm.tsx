"use client";

import { TermsStep } from "./TermsStep";
import { PersonalStep } from "./PersonalStep";
import { CompleteStep } from "./CompleteStep";
import { useSignUpForm } from "../../hooks/useKaKoSignUpForm";
import { SignUpStep } from "../../types/kakao-sign-up.types";
import { match } from "ts-pattern";
import { StepIndicator } from "./SignUpStepIndicator";
import { PersonalFormData } from "../../types";

export const KaKaoSignUpForm = () => {
  const {
    currentStep,
    handleTermsSubmit,
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
  handlePersonalSubmit: (data: PersonalFormData) => void;
  submitFinalSignUp: () => Promise<void>;
  isPending: boolean;
  error: Error | null;
}) {
  return match(currentStep)
    .with("약관동의", () => <TermsStep onSubmit={handleTermsSubmit} />)
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
