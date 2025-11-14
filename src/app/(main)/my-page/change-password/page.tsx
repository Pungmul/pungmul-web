"use client";

import ChangePasswordForm from "@pThunder/features/auth/components/widget/ChagePasswordForm";
import { useForm } from "react-hook-form";
import { ChangePasswordFormData } from "@pThunder/features/auth/types/change-password.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@pThunder/features/auth/types/change-password.schemas";
import { Header, Space } from "@pThunder/shared";
import { useChangePasswordRequest } from "@pThunder/features/auth/queries/useChagePasswordRequest";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const {
    formState: { errors: inputErrors, isValid },
    ...form
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: changePassword, isPending, error: requestError } = useChangePasswordRequest();
  const router = useRouter();

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(data, {
      onSuccess: () => {
        alert("비밀번호가 변경되었습니다.");
        router.replace("/my-page");
      },
      onError: (error) => {
        console.error(error);
        alert("비밀번호 변경에 실패했습니다.");
      },
    });
  };

  return (
    <div className="bg-grey-100 h-full w-full">
      <main className="max-w-[640px] mx-auto w-full h-full flex flex-col items-center bg-background">
        <Header title="비밀번호 변경" />
        <Space h={36} />
        <div className="w-full px-[36px]">
          <div className="p-[16px] bg-grey-200 rounded-[10px]">
            <p className="text-sm font-normal text-grey-600">로그인에 사용할 비밀번호를 변경해요.</p>
            <p className="text-sm font-normal text-grey-600">현재 비밀번호와 새로운 비밀번호를 입력해주세요.</p>
          </div>
        </div>
        <Space h={24} />

        <div className="w-full max-w-[640px] mx-auto px-[32px] flex-grow">
          <ChangePasswordForm
            {...form}
            onSubmit={onSubmit}
            isPending={isPending}
            requestError={requestError}
            inputErrors={inputErrors}
            isValid={isValid}
          />
        </div>
      </main>
    </div>
  );
}
