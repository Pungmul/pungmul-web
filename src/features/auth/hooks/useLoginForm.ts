"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useLoginRequest } from "../queries";
import { LoginFormType, loginSchema } from "../types/login.schema";
import { useLoginStore } from "../store";

export const useLoginForm = () => {
  const router = useRouter();
  const setLogin = useLoginStore((state) => state.setLogin);
  const {
    mutate: loginRequest,
    error: requestError,
    isPending,
  } = useLoginRequest();

  const {
    register,
    handleSubmit,
    formState: { errors: inputErrors, isValid },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      loginId: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormType) => {
    loginRequest(data, {
      onSuccess: () => {
        setLogin("email");
        router.replace("/home");
      },
    });
  };

  return {
    register,
    inputErrors,
    isValid,
    isPending,
    handleSubmit,
    onSubmit,
    requestError,
  };
};
