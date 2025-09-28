"use client";

import { TermsStep } from "./TermsStep";
import { PersonalStep } from "./PersonalStep";
import { CompleteStep } from "./CompleteStep";
import { useSignUpForm } from "../../hooks/useKaKaoSignUpForm";
import { SignUpStep } from "../../types/kakao-sign-up.types";
import { FullSignUpFormData } from "../../types/kakao-sign-up.schemas";
import { match } from "ts-pattern";
import { useKakaoSignUpRequest } from "../../hooks/useKakaoSignUpRequest";
import useTermsStep from "../../hooks/useTermStep";
import usePersonalStep from "../../hooks/usePersonalStep";
import { useRouter } from "next/navigation";

export const KaKaoSignUpForm = () => {
  const form = useSignUpForm();

  return (
    <section className="flex flex-col flex-grow flex-shrink-0">
      <KaKaoSignUpStepForms {...form} />
    </section>
  );
};

interface KaKaoSignUpStepFormsProps {
  data: FullSignUpFormData;
  onSubmit: (data: Partial<FullSignUpFormData>) => void;
  currentStep: SignUpStep;
  onNextStep: () => void;
}

function KaKaoSignUpStepForms({
  currentStep,
  onNextStep,
  ...rest
}: KaKaoSignUpStepFormsProps) {
  const router = useRouter();
  const { submitFinalSignUp, isPending, error } = useKakaoSignUpRequest();
  const termsForm = useTermsStep();
  const personalForm = usePersonalStep();

  return match(currentStep)
    .with("약관동의", () => <TermsStep {...termsForm} onSubmit={onNextStep} />)
    .with("개인정보입력", () => (
      <PersonalStep {...personalForm} onSubmit={onNextStep} />
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
