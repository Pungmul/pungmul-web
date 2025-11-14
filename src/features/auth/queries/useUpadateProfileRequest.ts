import { useMutation } from "@tanstack/react-query";
import { updateProfileAPI } from "../api";

export const useUpadateProfile = () => {
  return useMutation({
    mutationFn: updateProfileAPI,
  });
};
