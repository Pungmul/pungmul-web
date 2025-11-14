import { useMutation } from "@tanstack/react-query";
import { deleteInstrumentSkill } from "../api";
import { myPageQueryKeys } from "../constant";

export const useDeleteInstrumentSkill = () => {
  return useMutation({
    mutationFn: deleteInstrumentSkill,
    mutationKey: myPageQueryKeys.instrumentSkill(),
  });
};

