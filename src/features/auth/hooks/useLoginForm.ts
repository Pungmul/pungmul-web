"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useLoginRequest } from "../api/loginApi";
import { LoginFormType, loginSchema } from "../types/login.schema";

export const useLoginForm = () => {
  const router = useRouter();
  
  const { mutate: loginRequest, error: requestError, isPending } = useLoginRequest();

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
    console.log(data);
    loginRequest(data, {
      onSuccess: () => {
        router.replace("/home");
      },
      onError: (error) => {
        console.log(error);
      }
    });
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
