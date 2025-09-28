"use client";

import { Input, Spinner, Button } from "@/shared/components";
import { HookFormReturn } from "@pThunder/shared";

interface LoginFormProps
  extends HookFormReturn<{
    loginId: string;
    password: string;
  }> {
  onSubmit: ({
    loginId,
    password,
  }: {
    loginId: string;
    password: string;
  }) => void;
  isPending: boolean;
  requestError: Error | null;
}

function LoginForm({
  register,
  inputErrors,
  handleSubmit,
  onSubmit,
  isPending,
  requestError,
}: LoginFormProps) {
  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="ID"
        errorMessage={inputErrors.loginId?.message || ""}
        {...register("loginId")}
      />
      <Input
        label="비밀번호"
        errorMessage={inputErrors.password?.message || ""}
        isEncrypted={true}
        {...register("password")}
      />

      {requestError && (
        <p className="w-full text-red-400 px-[12px]">
          로그인 실패: {requestError.message}
        </p>
      )}

      <Button
        className="bg-primary text-background"
        type="submit"
        disabled={isPending}
      >
        {isPending ? <Spinner /> : "로그인"}
      </Button>
    </form>
  );
}

export default LoginForm;
