import { useMutation } from "@tanstack/react-query";
import { sendResetPasswordEmail } from "../api";

export const useSendResetPasswordEmail = () => {
  return useMutation({
    mutationFn: sendResetPasswordEmail,
  });
};
