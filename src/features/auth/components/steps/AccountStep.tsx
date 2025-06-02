"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FullSignUpFormData } from "../../types/sign-up.schemas";
import { Input } from "@/shared/components";

interface AccountStepProps {
  register: UseFormRegister<FullSignUpFormData>;
  errors: FieldErrors<FullSignUpFormData>;
}

export const AccountStep: React.FC<AccountStepProps> = ({
  register,
  errors,
}) => {

  return (
    <div
      className="flex flex-col flex-grow overflow-y-auto"
      style={{ gap: 20 }}
    >
      <Input
        label="이메일"
        name="email"
        register={register}
        errorMessage={errors.email?.message || ""}
        placeholder="로그인에 사용할 이메일을 입력해주세요."
        className="w-full"
      />

      <Input
        label="비밀번호"
        name="password"
        register={register}
        errorMessage={errors.password?.message || ""}
        placeholder="비밀번호를 입력해주세요."
        isEncrypted={true}
        className="w-full"
        type="password"
      />

      <Input
        label="비밀번호 확인"
        name="confirmPassword"
        register={register}
        errorMessage={errors.confirmPassword?.message || ""}
        placeholder="비밀번호를 다시 입력해주세요."
        isEncrypted={true}
        className="w-full"
        type="password"
      />
    </div>
  );
};
