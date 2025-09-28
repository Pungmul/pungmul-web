"use client";
import { Input, BottomFixedButton, Space } from "@pThunder/shared/components";
import { AccountFormData } from "../../types";
import { HookFormReturn } from "@pThunder/shared";

interface AccountStepProps
  extends Pick<
    HookFormReturn<AccountFormData>,
    "inputErrors" | "isValid" | "handleSubmit" | "register"
  > {
  onSubmit: ({ email, password, confirmPassword }: AccountFormData) => void;
}

export const AccountStep: React.FC<AccountStepProps> = ({
  register,
  inputErrors,
  isValid,
  handleSubmit,
  onSubmit,
}) => {
  console.log(inputErrors.email);
  return (
    <form
      className="flex flex-col flex-grow"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex-grow px-6">
        <Space h={24} />
        <Input
          label="이메일"
          placeholder="로그인에 사용할 이메일을 입력해주세요."
          {...register("email")}
          errorMessage={inputErrors.email?.message || ""}
        />

        <Space h={24} />
        <Input
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          isEncrypted={true}
          {...register("password")}
          errorMessage={inputErrors.password?.message || ""}
        />

        <Space h={24} />
        <Input
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해주세요."
          isEncrypted={true}
          {...register("confirmPassword")}
          errorMessage={inputErrors.confirmPassword?.message || ""}
        />
      </div>

      <BottomFixedButton
        disabled={!isValid}
        type="submit"
        className={"bg-primary disabled:bg-primary-light text-background"}
      >
        {isValid ? "다음" : "모든 필드를 입력해주세요"}
      </BottomFixedButton>
    </form>
  );
};
