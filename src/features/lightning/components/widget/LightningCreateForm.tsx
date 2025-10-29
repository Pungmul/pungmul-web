"use client";
import { BottomFixedButton, Header, Input } from "@/shared/components";
import { useLightningCreateForm } from "../../hooks/useLightningCreateForm";
import LightningAddressInput from "./LightningAddressInput";
import { FormProvider } from "react-hook-form";

// 필드 컴포넌트들
import PersonnelFields from "./fields/PersonnelFields";
import RecruitmentPeriodField from "./fields/RecruitmentPeriodField";
import TagField from "./fields/TagField";
import TimeField from "./fields/TimeField";
import LightningTypeField from "./fields/LightningTypeField";
import TargetField from "./fields/TargetField";

export default function LightningCreateForm() {
  return (
    <div className="relative flex flex-col w-full h-full">
      <Header title="번개 생성" />
      <CreateLightningFormBody />
    </div>
  );
}

const CreateLightningFormBody = () => {
  const form = useLightningCreateForm();

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(form.onSubmit)}
        className="flex flex-col "
      >
        <section className="flex flex-col gap-[16px] flex-1 px-[24px] py-[16px] ">
          <Input
            {...form.register("title")}
            label="모임 제목"
            placeholder="모임 제목을 입력해주세요"
            errorMessage={form.formState.errors.title?.message}
          />

          <LightningAddressInput />

          <Input
            {...form.register("detailAddress")}
            label="상세 주소"
            placeholder="상세 주소를 입력해주세요."
            errorMessage={
              form.formState.errors.detailAddress?.message
            }
          />

          <LightningTypeField />
          <TargetField />
          <TimeField />
          <PersonnelFields />
          <RecruitmentPeriodField />

          <TagField />
        </section>

        <BottomFixedButton
          disabled={!form.formState.isValid}
          className="bg-primary disabled:bg-grey-300 text-background"
          type="submit"
        >
          다음
        </BottomFixedButton>
      </form>
    </FormProvider>
  );
};
