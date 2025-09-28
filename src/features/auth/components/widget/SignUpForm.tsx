"use client";

import { TermsStep } from "./TermsStep";
import { PersonalStep } from "./PersonalStep";
import { CompleteStep } from "./CompleteStep";
import { useSignUpForm } from "../../hooks/useSignUpForm";
import { SignUpStep } from "../../types/sign-up.types";
import { FullSignUpFormData } from "../../types/sign-up.schemas";
import { match } from "ts-pattern";
import { useSignUpRequest } from "../../hooks/useSignUpRequest";
import useTermsStep from "../../hooks/useTermStep";
import usePersonalStep from "../../hooks/usePersonalStep";
import { useRouter } from "next/navigation";
import { AccountStep } from "./AccountStep";
import useAccountStep from "../../hooks/useAccountStep";

export const SignUpForm = () => {
  const form = useSignUpForm();

  return (
    <section className="flex flex-col flex-grow flex-shrink-0">
      <SignUpStepForms {...form} />
    </section>
  );
};

interface SignUpStepFormsProps {
  data: FullSignUpFormData;
  onSubmit: (data: Partial<FullSignUpFormData>) => void;
  currentStep: SignUpStep;
  onNextStep: () => void;
}

function SignUpStepForms({
  currentStep,
  onNextStep,
  ...rest
}: SignUpStepFormsProps) {
  const router = useRouter();
  const { submitFinalSignUp, isPending, error } = useSignUpRequest();
  const termsForm = useTermsStep();
  const accountForm = useAccountStep();
  const personalForm = usePersonalStep();

  return match(currentStep)
    .with("약관동의", () => (
      <TermsStep
        {...termsForm}
        onSubmit={(data) => {
          rest.onSubmit({ ...rest.data, ...data });
          onNextStep();
        }}
      />
    ))
    .with("계정정보입력", () => (
      <AccountStep
        {...accountForm}
        onSubmit={(data) => {
          rest.onSubmit({ ...rest.data, ...data });
          onNextStep();
        }}
      />
    ))
    .with("개인정보입력", () => (
      <PersonalStep
        {...personalForm}
        onSubmit={(data) => {
          rest.onSubmit({ ...rest.data, ...data });
          onNextStep();
        }}
      />
    ))
    .with("완료", () => (
      <CompleteStep
        submitFinalSignUp={() =>
          submitFinalSignUp(rest.data, {
            onSuccess: () => {
              router.push("/home");
            },
            onError: (error) => {
              console.error(error);
            },
          })
        }
        isPending={isPending}
        error={error}
      />
    ))
    .exhaustive();
}
