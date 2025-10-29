"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lightningCreateSchema, LightningCreateFormData } from "../types/lightningCreate.schemas";
import { useLightningCreateStore } from "../store/lightningCreateStore";
import { useRouter } from "next/navigation";

export const useLightningCreateForm = () => {
  const { formData, setFormData } = useLightningCreateStore();
  const router = useRouter();
  const form = useForm<LightningCreateFormData>({
    resolver: zodResolver(lightningCreateSchema),
    defaultValues: {
      ...formData,
      // recruitmentPeriod가 비어있으면 기본값 설정
      recruitmentPeriod: formData.recruitmentPeriod || 5,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  
  const onSubmit = (data: LightningCreateFormData) => {
    setFormData(data); // 최종 데이터 저장
    router.replace("/lightning/create/check");
  };
  
  return {
    ...form,
    onSubmit,
    // Zustand 상태도 함께 반환
    formData: useLightningCreateStore((state) => state.formData),
    isSubmitting: useLightningCreateStore((state) => state.isSubmitting),
  };
};
