import { useMutation } from "@tanstack/react-query";
import { LoginResponse } from "../types/login-response";
import { LoginRequest } from "../types/login-request";

async function loginApi(
  loginId: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId, password }),
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(err);
    });

  return response;
}

export const useLoginRequest = () => {
  return useMutation({
    mutationFn: ({ loginId, password }: LoginRequest) =>
      loginApi(loginId, password),
  });
};
