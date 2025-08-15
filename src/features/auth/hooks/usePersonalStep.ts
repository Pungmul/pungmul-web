import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatPhoneNumber } from "../lib";
import { PersonalFormData, personalSchema } from "../types";

export const usePersonalStep = () => {
  const form = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      nickname: "",
      club: undefined,
      tellNumber: "",
      inviteCode: "",
    },
  });

  const { name, nickname, club, tellNumber, inviteCode } = form.watch();

  // 전화번호 자동 포맷팅
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    form.setValue("tellNumber", formattedValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const isProgressable = name && tellNumber && inviteCode && form.formState.isValid;

  return {
    form,
    isProgressable,
    name,
    nickname,
    club,
    tellNumber,
    inviteCode,
    handlePhoneNumberChange,
  };
};

export default usePersonalStep;
