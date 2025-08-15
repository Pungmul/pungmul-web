import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";

interface TermFormData {
  usingTermAgree: boolean;
  personalInfoAgree: boolean;
}

export const useTermStep = () => {
  const [allAgree, setAllAgree] = useState(false);
  
  const form = useForm<TermFormData>({
    defaultValues: {
      usingTermAgree: false,
      personalInfoAgree: false,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Form 값들을 watch로 실시간 추적
  const { usingTermAgree, personalInfoAgree } = form.watch();


  const handleTermAgree = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      form.setValue("usingTermAgree", checked);
      setAllAgree(checked && form.getValues("personalInfoAgree"));
    },
    [form]
  );

  const handlePersonalInfoAgree = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      form.setValue("personalInfoAgree", checked);
      setAllAgree(checked && form.getValues("usingTermAgree"));
    },
    [form]
  );

  const handleAllAgree = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      form.setValue("usingTermAgree", checked);
      form.setValue("personalInfoAgree", checked);
      setAllAgree(checked);
    },
    [form]
  );

  // 진행 가능 여부는 allAgree와 동일
  const isProgressable = allAgree;

  return {
    form,
    handleTermAgree,
    handlePersonalInfoAgree,
    handleAllAgree,
    allAgree,
    isProgressable,
    // Form 값들도 직접 노출
    usingTermAgree,
    personalInfoAgree,
  };
};

export default useTermStep;
