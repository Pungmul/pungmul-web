"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useLoginRequest } from "../api/loginApi";
import { LoginFormType, loginSchema } from "../types/login.schema";

export const useLoginForm = () => {
  const router = useRouter();
  
  const { mutate: loginRequest, error: requestError, isPending } = useLoginRequest({
    onSuccess: async () => {
      router.replace("/home");
    },
    onError: async (error) => {
      console.log(error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors:inputErrors, isValid },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      loginId: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data: LoginFormType) => {
    loginRequest(data);
  });

  return {
    register,
    inputErrors,
    isValid,
    isPending,
    onSubmit,
    requestError,
  };
};
