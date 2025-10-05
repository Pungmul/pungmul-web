"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Space, Spinner, Header, Toast, Button } from "@/shared";

import { PromotionPosterForm } from "./PromotionPoster";
import { PromotionInfoForm } from "./PromotionInfoForm";
import { PromotionTabs } from "./PromotionTabs";
import { usePromotionPostingStore } from "../../store/promotionPostingStore";
import { FormDetailDto } from "../../types";

interface PromotionPostingFormProps {
  form: FormDetailDto;
}

export const PromotionPostingForm = ({ form }: PromotionPostingFormProps) => {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");
  const router = useRouter();

  const { isPending, initializeForm, submitForm, saveForm } =
    usePromotionPostingStore();

  useEffect(() => {
    initializeForm(form);
  }, [form, initializeForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formId) {
      console.error("Form ID is missing.");
      return;
    }

    submitForm({
      formId: Number(formId),
      onSuccess: (data) => {
        Toast.show({
          message: "폼이 성공적으로 제출되었습니다!",
          type: "success",
          duration: 3000,
        });
        router.replace(`/board/promote/d/${data.publicKey}`);
      },
    });
  };

  return (
    <>
      <Header
        title="공연 등록"
        onLeftClick={() => {
          window.history.back();
        }}
        rightBtn={
          isPending ? (
            <Spinner size={24} />
          ) : (
            <button
              onClick={() =>
                saveForm({
                  formId: Number(formId),
                  onSuccess: () => {
                    Toast.show({
                      message: "임시 저장 완료",
                      type: "success",
                      duration: 3000,
                    });
                  },
                  onError: () => {
                    Toast.show({
                      message: "임시 저장 실패",
                      type: "error",
                      duration: 3000,
                    });
                  },
                })
              }
              className="text-center text-grey-500 cursor-pointer text-[16px]"
            >
              임시 저장
            </button>
          )
        }
      />
      <form
        className="relative flex flex-col px-[24px] py-[12px]"
        onSubmit={handleSubmit}
      >
        <PromotionPosterForm />
        <Space h={32} />

        <PromotionInfoForm />
        <Space h={32} />

        <PromotionTabs />

        <Space h={64} />

        <footer className="sticky w-full bottom-0 z-10 flex flex-row justify-start max-w-[640px] min-w-[320px] mx-auto p-[12px] px-[4px] pb-[24px] py-[32px] bg-gradient-to-t from-background via-background via-80% to-transparent">
          <Button
            disabled={isPending}
            type="submit"
            className={
              "w-full border-primary bg-primary text-background py-2 rounded-md flex justify-center items-center " +
              (isPending ? " bg-primary-light" : " cursor-pointer")
            }
          >
            {isPending ? <Spinner /> : "등록하기"}
          </Button>
        </footer>
      </form>
    </>
  );
};
