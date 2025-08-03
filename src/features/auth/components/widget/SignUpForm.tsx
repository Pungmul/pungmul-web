"use client";

import { TermsStep } from "./TermsStep";
import { AccountStep } from "./AccountStep";
import { PersonalStep } from "./PersonalStep";
import { useSignUpForm } from "../../hooks/useSignUpForm";
import { SignUpStep } from "../../types/sign-up.types";
import { match } from "ts-pattern";

export const SignUpForm = () => {
  const {
    currentStep,
    handleNextStep,
    isCurrentStepValid,
    isPending,
    ...form
  } = useSignUpForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleNextStep();
  };

  return (
    <div className="h-full w-full flex flex-col justify-center">
      <div className="flex flex-col flex-grow flex-shrink-0">
        <StepIndicator currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <SignUpStepForms currentStep={currentStep} props={form} />
          <div className="w-full py-4" style={{ padding: "12px 36px" }}>
            <button
              type="submit"
              disabled={!isCurrentStepValid() || isPending}
              className="w-full flex items-center justify-center text-white rounded"
              style={{
                height: 48,
                backgroundColor:
                  isCurrentStepValid() && !isPending ? "#816DFF" : "#e2deff",
                cursor:
                  isCurrentStepValid() && !isPending
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              {isPending
                ? "처리 중..."
                : currentStep === "개인정보입력"
                ? "회원 가입 하기"
                : "다음"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function SignUpStepForms({
  currentStep,
  props,
}: {
  currentStep: SignUpStep;
  props: Omit<
    ReturnType<typeof useSignUpForm>,
    "currentStep" | "handleNextStep" | "isCurrentStepValid" | "isPending"
  >;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    usingTermAgree,
    setUsingTermAgree,
    personalInfoAgree,
    setPersonalInfoAgree,
  } = props;

  return match(currentStep)
    .with("약관동의", () => (
      <TermsStep
        usingTermAgree={usingTermAgree}
        setUsingTermAgree={setUsingTermAgree}
        personalInfoAgree={personalInfoAgree}
        setPersonalInfoAgree={setPersonalInfoAgree}
      />
    ))
    .with("계정정보입력", () => (
      <AccountStep register={register} errors={errors} />
    ))
    .with("개인정보입력", () => (
      <PersonalStep
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />
    ))
    .exhaustive();
}

function StepIndicator({ currentStep }: { currentStep: SignUpStep }) {
  return (
    <div
      className="flex flex-row items-center"
      style={{ margin: "28px auto", padding: "0 12px", paddingTop: 4 }}
    >
      <div
        className="flex flex-col items-center overflow-visible"
        style={{ gap: 8, width: 48 }}
      >
        <div
          className={`flex items-center justify-center ${
            currentStep === "약관동의" ? " bg-[#816DFF]" : " bg-[#D9D9D9]"
          }  rounded-full`}
          style={{ height: 36, width: 36 }}
        >
          <div className="text-white">1</div>
        </div>
        <div
          style={{
            fontSize: 14,
            textAlign: "center",
            color: currentStep === "약관동의" ? "#816DFF" : "#D9D9D9",
            lineHeight: "110%",
            width: 100,
          }}
        >
          약관동의
        </div>
      </div>
      <div
        className="border-dashed border border-[#D9D9D9]"
        style={{ width: 65, marginBottom: 28 }}
      />

      <div
        className="flex flex-col items-center overflow-visible"
        style={{ gap: 8, width: 48 }}
      >
        <div
          className={`flex items-center justify-center ${
            currentStep === "계정정보입력" ? " bg-[#816DFF]" : " bg-[#D9D9D9]"
          }  rounded-full`}
          style={{ height: 36, width: 36 }}
        >
          <div className="text-white">2</div>
        </div>
        <div
          style={{
            fontSize: 14,
            textAlign: "center",
            color: currentStep === "계정정보입력" ? "#816DFF" : "#D9D9D9",
            lineHeight: "110%",
            width: 100,
          }}
        >
          계정 정보 입력
        </div>
      </div>

      <div
        className="border-dashed border border-[#D9D9D9]"
        style={{ width: 65, marginBottom: 28 }}
      />

      <div
        className="flex flex-col items-center overflow-visible"
        style={{ gap: 8, width: 48 }}
      >
        <div
          className={`flex items-center justify-center ${
            currentStep === "개인정보입력" ? " bg-[#816DFF]" : " bg-[#D9D9D9]"
          }  rounded-full`}
          style={{ height: 36, width: 36 }}
        >
          <div className="text-white">3</div>
        </div>
        <div
          style={{
            fontSize: 14,
            textAlign: "center",
            color: currentStep === "개인정보입력" ? "#816DFF" : "#D9D9D9",
            lineHeight: "110%",
            width: 100,
          }}
        >
          개인 정보 입력
        </div>
      </div>
    </div>
  );
}
