import { useMutation } from "@tanstack/react-query";
import { kakaoSignUpRequest } from "../api";

export const useKakaoSignUpRequest = () => {
  return useMutation({
    mutationFn: kakaoSignUpRequest,
  });
};
