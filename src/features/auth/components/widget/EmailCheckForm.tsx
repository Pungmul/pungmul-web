"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSendResetPasswordEmail } from "@pThunder/features/auth/queries";
import {
  EmailCheckFormData,
  emailCheckSchema,
} from "@pThunder/features/auth/types/reset-password.schemas";
import { BottomFixedButton } from "@pThunder/shared/components/buttons";
import { Input, Space, Spinner } from "@pThunder/shared";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function EmailCheckForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: inputErrors, isValid },
  } = useForm<EmailCheckFormData>({
    resolver: zodResolver(emailCheckSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const { mutate: sendResetPasswordEmail, isPending } =
    useSendResetPasswordEmail();

  const onSubmit = (data: EmailCheckFormData) => {
    sendResetPasswordEmail(
      {
        email: data.email,
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

  return (
    <section className="flex flex-col flex-grow">
      <Space h={24} />
      <div className="px-6">
        <p className="lg:text-[15px] text-[13px] font-normal text-grey-500 bg-grey-100 px-[16px] py-[12px] rounded-[5px] whitespace-pre-line">
          {
            "비밀번호를 다시 설정할 수 있는 링크를 보내드릴게요.\n로그인하실 때 사용하시는 이메일 주소를 입력해주세요."
          }
        </p>
      </div>
      <Space h={24} />
      <form
        className="flex flex-col gap-[16px] flex-grow"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-grow px-6">
          <Input
            label="이메일"
            placeholder="이메일을 입력해주세요."
            className="w-full"
            errorMessage={inputErrors.email?.message || ""}
            {...register("email")}
          />
        </div>
        <BottomFixedButton
          disabled={isPending || !isValid}
          type="submit"
          className="bg-primary disabled:bg-primary-light text-background mx-auto max-w-[768px]"
        >
          {isPending ? <Spinner /> : "이메일 전송"}
        </BottomFixedButton>
      </form>
    </section>
  );
}


