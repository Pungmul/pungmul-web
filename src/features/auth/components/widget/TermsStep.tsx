"use client";

import Link from "next/link";
import { Controller, UseFormReturn } from "react-hook-form";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import { Space, Checkbox, BottomFixedButton } from "@pThunder/shared";

import { TermsStepFormData } from "../../types/kakao-sign-up.schemas";

interface TermsStepProps
  extends Pick<UseFormReturn<TermsStepFormData>, "control" | "handleSubmit"> {
  onSubmit: (data: TermsStepFormData) => void;
  isAllchecked: boolean;
  handleAllCheck: (checked: boolean) => void;
}

export const TermsStep: React.FC<TermsStepProps> = ({
  onSubmit,
  control,
  handleSubmit,
  isAllchecked,
  handleAllCheck,
}) => {
  return (
    <form
      className="flex flex-col flex-grow"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Space h={24}/>
      <div className="flex-grow px-6">
        <Checkbox
          name="all_check"
          label="모든 약관에 동의합니다"
          required
          checked={isAllchecked}
          onChange={handleAllCheck}
          className="bg-grey-100 rounded-[6px]"
        />

        <Space h={16} />

        <div className="flex flex-row justify-between items-center">
          <Controller
            control={control}
            name="usingTermAgree"
            render={({ field }) => (
              <Checkbox
                {...field}
                label="이용 약관에 동의합니다"
                required
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Link href="/terms/서비스 이용약관.html" target="_blank">
            <ChevronRightIcon className="w-[16px] h-[16px] cursor-pointer" />
          </Link>
        </div>

        <Space h={4} />

        <div className="flex flex-row justify-between items-center">
          <Controller
            control={control}
            name="personalInfoAgree"
            render={({ field }) => (
              <Checkbox
                label="개인정보 이용에 동의합니다"
                required
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Link href="/terms/개인정보 처리방침.html" target="_blank">
            <ChevronRightIcon className="w-[16px] h-[16px] cursor-pointer" />
          </Link>
        </div>
      </div>
      <BottomFixedButton
        disabled={!isAllchecked}
        type="submit"
        className={"bg-primary disabled:bg-primary-light text-background"}
      >
        {isAllchecked ? "다음" : "약관에 동의해주세요"}
      </BottomFixedButton>
    </form>
  );
};
