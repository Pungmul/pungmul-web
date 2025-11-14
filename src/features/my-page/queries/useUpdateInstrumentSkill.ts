import { useMutation } from "@tanstack/react-query";
import { updateInstrumentSkill } from "../api";
import { myPageQueryKeys } from "../constant";

export const useUpdateInstrumentSkill = () => {
  return useMutation({
    mutationFn: updateInstrumentSkill,
    mutationKey: myPageQueryKeys.instrumentSkill(),
  });
};

