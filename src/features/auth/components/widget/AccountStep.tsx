"use client";

import { Input } from "@/shared/components";
import useAccountStep from "../../hooks/useAccountStep";
import { SubmitHandler } from "react-hook-form";

interface AccountStepFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface AccountStepProps {
  onSubmit: (data: AccountStepFormData) => void;
}

export const AccountStep: React.FC<AccountStepProps> = ({ onSubmit }) => {
  const { form, isProgressable } = useAccountStep();
  const handleSubmit: SubmitHandler<AccountStepFormData> = (data) => onSubmit(data)
  
  return (
    <form
      className="flex flex-col flex-grow overflow-y-auto"
      style={{ gap: 20 }}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <Input
        label="이메일"
        errorMessage={form.formState.errors.email?.message || ""}
        placeholder="로그인에 사용할 이메일을 입력해주세요."
        className="w-full"
        {...form.register("email")}
      />

      <Input
        label="비밀번호"
        errorMessage={form.formState.errors.password?.message || ""}
        placeholder="비밀번호를 입력해주세요."
        isEncrypted={true}
        className="w-full"
        type="password"
        {...form.register("password")}
      />

      <Input
        label="비밀번호 확인"
        errorMessage={form.formState.errors.confirmPassword?.message || ""}
        placeholder="비밀번호를 다시 입력해주세요."
        isEncrypted={true}
        className="w-full"
        type="password"
        {...form.register("confirmPassword")}
      />

      <div className="w-full py-4" style={{ padding: "12px 36px" }}>
        <button
          type="submit"
          disabled={!isProgressable}
          className="w-full flex items-center justify-center text-white rounded"
          style={{
            height: 48,
            backgroundColor: isProgressable ? "#816DFF" : "#e2deff",
            cursor: isProgressable ? "pointer" : "not-allowed",
          }}
        >
          {isProgressable ? "다음" : "모든 필드를 입력해주세요"}
        </button>
      </div>
    </form>
  );
};
