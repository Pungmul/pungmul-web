import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountFormData, accountSchema } from "../types/sign-up.schemas";

export const useAccountStep = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: inputErrors, isValid },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return {
    register,
    inputErrors,
    isValid,
    handleSubmit,
  };
};

export default useAccountStep;
