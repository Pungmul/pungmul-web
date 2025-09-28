import { useMutation } from "@tanstack/react-query";
import { signUpRequest } from "../api";

export const useSignUpRequest = () => {
    return useMutation({
      mutationFn: signUpRequest
    });
  }; 