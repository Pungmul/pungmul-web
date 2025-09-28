import { useMutation } from "@tanstack/react-query";
import { LoginRequest } from "../types/login-request";
import { loginApi } from "../api";

export const useLoginRequest = () => {
    return useMutation({
      mutationFn: ({ loginId, password }: LoginRequest) =>
        loginApi(loginId, password),
    });
  };
  