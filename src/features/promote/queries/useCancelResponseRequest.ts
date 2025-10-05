import { useMutation } from "@tanstack/react-query";
import { cancelResponseAPI } from "../api/cancelResponseAPI";

export const useCancelResponseRequest = () => {
  return useMutation({
    mutationFn: cancelResponseAPI,
  });
};
