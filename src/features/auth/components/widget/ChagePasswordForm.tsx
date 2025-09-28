"use client";

import { HookFormReturn } from "@pThunder/shared";
import { Input, Spinner, BottomFixedButton } from "@pThunder/shared/components";
import { ChangePasswordFormData } from "@pThunder/features/auth/types/change-password.schemas";

interface ChangePasswordFormProps
  extends HookFormReturn<ChangePasswordFormData> {
  onSubmit: ({
    currentPassword,
    newPassword,
    confirmPassword,
  }: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  isPending: boolean;
  requestError: Error | null;
}

export default function ChangePasswordForm({
  onSubmit,
  isPending,
  requestError,
  ...form
}: ChangePasswordFormProps) {
  return (
    <form
      className="flex w-full flex-col h-full"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 flex-grow px-[12px]">
        <Input
          label="현재 비밀번호"
          type="password"
          {...form.register("currentPassword")}
          errorMessage={form.inputErrors.currentPassword?.message || ""}
        />
        <Input
          label="신규 비밀번호"
          type="password"
          {...form.register("newPassword")}
          placeholder="새로운 비밀번호를 입력해주세요."
          errorMessage={form.inputErrors.newPassword?.message || ""}
        />
        <Input
          label="비밀번호 확인"
          type="password"
          {...form.register("confirmPassword")}
          placeholder="새로운 비밀번호를 다시 입력해주세요."
          errorMessage={form.inputErrors.confirmPassword?.message || ""}
        />
      </div>

      {requestError && (
        <p className="w-full text-red-400 px-[12px]">
          비밀번호 변경 실패: {requestError.message}
        </p>
      )}

      <BottomFixedButton
        className="bg-primary text-background"
        type="submit"
        disabled={isPending || !form.isValid}
      >
        {isPending ? <Spinner /> : "비밀번호 변경"}
      </BottomFixedButton>
    </form>
  );
}
