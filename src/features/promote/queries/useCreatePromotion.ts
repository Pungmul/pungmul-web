import { useMutation } from "@tanstack/react-query";
import { requestCreatePromotion } from "../api";

export const useCreatePromotion = () => {
  return useMutation({
    mutationFn: requestCreatePromotion,
  });
};


