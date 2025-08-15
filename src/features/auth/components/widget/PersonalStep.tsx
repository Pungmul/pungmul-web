"use client";

import { Input } from "@/shared/components";
import { Selector } from "@/shared/components/form/Selector";
import { CLUB_OPTIONS } from "@/features/club/types/constant";
import usePersonalStep from "../../hooks/usePersonalStep";
import { PersonalFormData } from "../../types";

interface PersonalStepProps {
  onSubmit: (data: PersonalFormData) => void;
}

export const PersonalStep: React.FC<PersonalStepProps> = ({ onSubmit }) => {
  const { form, isProgressable, club, handlePhoneNumberChange } =
    usePersonalStep();

  return (
    <form
      className="flex flex-col flex-grow overflow-y-auto"
      style={{ gap: 20 }}
      onSubmit={(e) => {
        e.preventDefault();
        const data: PersonalFormData = form.getValues();
        onSubmit(data);
      }}
    >
      <Input
        label="이름"
        errorMessage={form.formState.errors.name?.message || ""}
        placeholder="이름을 입력해주세요."
        className="w-full"
        {...form.register("name")}
      />

      <Input
        label="패명"
        errorMessage={form.formState.errors.nickname?.message || ""}
        placeholder="패명을 입력해주세요."
        className="w-full"
        {...form.register("nickname")}
      />

      <Selector
        label="소속패"
        items={CLUB_OPTIONS}
        selectedItem={club ?? undefined}
        onSelect={(item) => form.setValue("club", item)}
        errorMessage={form.formState.errors.club?.message || ""}
        hasSearch={true}
      />

      <Input
        label="전화번호"
        errorMessage={form.formState.errors.tellNumber?.message || ""}
        placeholder="전화번호를 입력해주세요."
        className="w-full"
        type="tel"
        {...form.register("tellNumber", {
          onChange: handlePhoneNumberChange,
        })}
      />

      <Input
        label="초대 코드"
        errorMessage={form.formState.errors.inviteCode?.message || ""}
        placeholder="초대 코드를 입력해주세요."
        className="w-full"
        type="number"
        {...form.register("inviteCode")}
      />

      <div className="w-full py-4" style={{ padding: "12px 36px" }}>
        <button
          type="submit"
          disabled={!isProgressable}
          className="w-full flex items-center justify-center text-white rounded"
          style={{
            height: 48,
            backgroundColor: isProgressable ? "#816DFF" : "#e2deff",
            cursor: isProgressable ? "pointer" : "not-allowed",
          }}
        >
          {isProgressable ? "회원가입 완료" : "모든 필드를 입력해주세요"}
        </button>
      </div>
    </form>
  );
};
