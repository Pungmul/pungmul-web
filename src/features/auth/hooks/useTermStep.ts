import { useForm } from "react-hook-form";
import {
  termsAgreementSchema,
  TermsStepFormData,
} from "../types/kakao-sign-up.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

export const useTermStep = () => {
  const { watch, ...form } = useForm<TermsStepFormData>({
    defaultValues: {
      usingTermAgree: false,
      personalInfoAgree: false,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(termsAgreementSchema),
  });

  const [isAllchecked, setIsAllchecked] = useState(false);

  useEffect(() => {
    const subscription = watch(({ usingTermAgree, personalInfoAgree }) => {
      setIsAllchecked(usingTermAgree! && personalInfoAgree!);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleAllCheck = (checked: boolean) => {
    form.setValue("usingTermAgree", checked);
    form.setValue("personalInfoAgree", checked);
  };

  return {
    ...form,
    isAllchecked,
    handleAllCheck,
  };
};

export default useTermStep;
