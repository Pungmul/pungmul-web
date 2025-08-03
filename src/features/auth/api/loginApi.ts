import { useMutation } from "@tanstack/react-query";
import { LoginResponse } from "../types/login-response";
import { LoginMethod, LoginRequest } from "../types/login-request";
import { useLoginStore } from "../stores/loginStore";

async function loginApi(
  loginId: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch("/login/api", {
    method: "POST",
    body: JSON.stringify({ loginId, password }),
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(err);
    });

  return response;
}

export const useLoginRequest = ({
  onSuccess,
  onError,
  loginMethod = "email",
}: {
  onSuccess: (data: LoginResponse) => void;
  onError: (error: Error) => void;
  loginMethod?: LoginMethod;
}) => {
  return useMutation({
    mutationFn: ({ loginId, password }: LoginRequest) =>
      loginApi(loginId, password),
    onSuccess: (data) => {
      onSuccess(data);
      useLoginStore.setState({
        isLoggedIn: true,
        lastLoginTime: new Date(),
        loginMethod,
      });
    },
    onError,
  });
};
