import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@pThunder/core";
import { savePromotionForm } from "../api";
import type { FormSaveDto } from "../types";

export const useSavePromotionForm = () => {
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({ formId, form }: { formId: number; form: FormSaveDto }) =>
      savePromotionForm(formId, form),
    onSuccess: (_, { formId }) => {
      queryClient.invalidateQueries({
        queryKey: ["formDetail", "myPromotionFormList", formId],
      });
    },
    onError: (error) => {
      console.error("폼 저장 중 에러:", error);
    },
  });
};


