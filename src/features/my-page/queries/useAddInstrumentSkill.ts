import { useMutation } from "@tanstack/react-query";
import { addInstrumentSkill } from "../api";
import { myPageQueryKeys } from "../constant";

export const useAddInstrumentSkill = () => {
  return useMutation({
    mutationFn: addInstrumentSkill,
    mutationKey: myPageQueryKeys.instrumentSkill(),
  });
};

