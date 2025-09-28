"use client";

import { Input, Space, Select, BottomFixedButton } from "@/shared/components";
import { useClubOptions } from "@/features/club/hooks";
import usePersonalStep from "../../hooks/usePersonalStep";
import { PersonalFormData } from "../../types";
import { formatPhoneNumber } from "../../lib";
import { HookFormReturn } from "@pThunder/shared";
import { Controller } from "react-hook-form";

interface PersonalStepProps extends HookFormReturn<PersonalFormData> {
  onSubmit: (data: PersonalFormData) => void;
}

export const PersonalStep: React.FC<PersonalStepProps> = ({ onSubmit }) => {
  const { register, handleSubmit, inputErrors, isValid, control } =
    usePersonalStep();
  const clubOptions = useClubOptions();

  return (
    <form
      className="flex flex-col flex-grow px-[24px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex-grow px-6">
        <Space h={24} />
        <Input
          label="이름"
          errorMessage={inputErrors.name?.message || ""}
          placeholder="이름을 입력해주세요."
          className="w-full"
          {...register("name")}
        />

        <Space h={24} />
        <Input
          label="패명"
          errorMessage={inputErrors.nickname?.message || ""}
          placeholder="패명을 입력해주세요."
          className="w-full"
          {...register("nickname")}
        />

        <Space h={24} />
        <Controller
          control={control}
          name="club"
          render={({ field }) => (
            <Select
              name="club"
              label="소속패"
              errorMessage={inputErrors.club?.message || ""}
              hasSearch={true}
              onChange={(value) => {
                field.onChange(value);
              }}
              value={field.value}
            >
              {clubOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          )}
        />

        <Space h={24} />
        <Input
          label="학번"
          errorMessage={inputErrors.clubAge?.message || ""}
          placeholder="학번을 입력해주세요."
          className="w-full"
          {...register("clubAge")}
        />

        <Space h={24} />
        <Controller
          control={control}
          name="tellNumber"
          render={({ field }) => (
            <Input
              label="전화번호"
              errorMessage={inputErrors.tellNumber?.message || ""}
              placeholder="전화번호를 입력해주세요."
              className="w-full"
              type="tel"
              {...field}
              onChange={(e) => {
                const formattedValue = formatPhoneNumber(e.target.value);
                field.onChange(formattedValue);
              }}
            />
          )}
        />

        <Space h={24} />
        <Input
          label="초대 코드"
          errorMessage={inputErrors.inviteCode?.message || ""}
          placeholder="초대 코드를 입력해주세요."
          className="w-full"
          type="number"
          {...register("inviteCode")}
        />
      </div>

      <BottomFixedButton disabled={!isValid} type="submit">
        {isValid ? "회원가입 완료" : "모든 필드를 입력해주세요"}
      </BottomFixedButton>
    </form>
  );
};
