"use client";


import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FullSignUpFormData } from "../../types/sign-up.schemas";
import { Input } from "@/shared/components";
import { Selector } from "@/shared/components/form/Selector";
import { CLUB_OPTIONS } from "@/features/club/types/constant";

interface PersonalStepProps {
  register: UseFormRegister<FullSignUpFormData>;
  errors: FieldErrors<FullSignUpFormData>;
  setValue: UseFormSetValue<FullSignUpFormData>;
  watch: UseFormWatch<FullSignUpFormData>;
}

export const PersonalStep: React.FC<PersonalStepProps> = ({
  register,
  errors,
  setValue,
  watch,
}) => {
  const club = watch("club");

  return (
    <div
      className="flex flex-col flex-grow overflow-y-auto"
      style={{ gap: 20 }}
    >
      <Input
        label="이름"
        name="name"
        register={register}
        errorMessage={errors.name?.message || ""}
        placeholder="이름을 입력해주세요."
        className="w-full"
      />

      <Input
        label="패명"
        name="nickname"
        register={register}
        errorMessage={errors.nickname?.message || ""}
        placeholder="패명을 입력해주세요."
        className="w-full"
      />

      <Selector
        label="소속패"
        items={CLUB_OPTIONS}
        selectedItem={club}
        onSelect={(item) => setValue("club", item)}
        errorMessage={errors.club?.message || ""}
        hasSearch={true}
      />

      <Input
        label="전화번호"
        name="tellNumber"
        register={register}
        errorMessage={errors.tellNumber?.message || ""}
        placeholder="전화번호를 입력해주세요."
        className="w-full"
        type="tel"
      />

      <Input
        label="초대 코드"
        name="inviteCode"
        register={register}
        errorMessage={errors.inviteCode?.message || ""}
        placeholder="초대 코드를 입력해주세요."
        className="w-full"
        type="number"
      />
    </div>
  );
};
