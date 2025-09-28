import { useMutation } from "@tanstack/react-query";
import { resetPasswordRequest } from "../api";

export const useResetPasswordRequest = () => {
  return useMutation({
    mutationFn: resetPasswordRequest,
  });
};
