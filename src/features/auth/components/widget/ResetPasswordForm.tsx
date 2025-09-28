"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordRequest } from "@pThunder/features/auth/queries";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@pThunder/features/auth/types/reset-password.schemas";
import { BottomFixedButton, Button } from "@pThunder/shared/components/buttons";
import { Input, Spinner } from "@pThunder/shared";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: inputErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: resetPassword, isPending } = useResetPasswordRequest();

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      return;
    }

    resetPassword(
      {
        password: data.password,
        confirmPassword: data.confirmPassword,
        token,
      },
      {
        onSuccess: () => {
          router.push("/login");
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  if (!token) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-dvh gap-[24px]">
        <h1 className="text-2xl">토큰이 유효하지 않습니다: 잘못된 접근입니다.</h1>
        <Button
          className="bg-primary text-background"
          onClick={() => router.push("/login")}
        >
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  return (
    <section>
      <div className="w-full max-w-[640px] mx-auto px-[24px]">
        <h1 className="text-2xl font-bold">비밀번호 재설정</h1>
      </div>
      <div className="w-full max-w-[640px] mx-auto px-[24px]">
        <form
          className="flex flex-col gap-[16px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="새 비밀번호"
            placeholder="새 비밀번호를 입력해주세요."
            className="w-full"
            type="password"
            isEncrypted
            errorMessage={inputErrors.password?.message || ""}
            {...register("password")}
          />
          <Input
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요."
            className="w-full"
            type="password"
            isEncrypted
            errorMessage={inputErrors.confirmPassword?.message || ""}
            {...register("confirmPassword")}
          />
          <BottomFixedButton
            disabled={isPending}
            type="submit"
            className="bg-primary text-background"
          >
            {isPending ? <Spinner /> : "비밀번호 재설정"}
          </BottomFixedButton>
        </form>
      </div>
    </section>
  );
}


