import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountFormData, accountSchema } from "../types/sign-up.schemas";


export const useAccountStep = () => {
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { email, password, confirmPassword } = form.watch();

  const isProgressable = email && password && confirmPassword && form.formState.isValid;

  return {
    form,
    isProgressable,
    email,
    password,
    confirmPassword,
  };
};

export default useAccountStep;
