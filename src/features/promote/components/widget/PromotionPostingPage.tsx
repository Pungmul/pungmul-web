"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@pThunder/shared";

import { PromotionPostingForm } from "./PromotionPostingForm";
import { FormDetailDto } from "../../types";

const fetchForm = async (formId: string): Promise<FormDetailDto> => {
  const response = await fetch(`/api/promotions/forms/${formId}`);
  const form: FormDetailDto = await response.json();
  return form;
};

export function PromotionPostingPage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  const { data: form, isLoading: isFormLoading } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => fetchForm(formId ?? ""),
    enabled: !!formId,
  });

  if (!formId) return null;
  if (isFormLoading)
    return (
      <div className="flex flex-1 items-center justify-center h-full w-full">
        <Spinner />
      </div>
    );
  if (!form)
    return (
      <div className="flex items-center justify-center h-full w-full">
        폼을 찾을 수 없습니다.
      </div>
    );
  return <PromotionPostingForm form={form} />;
}
