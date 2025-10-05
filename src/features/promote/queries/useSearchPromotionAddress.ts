import { useMutation } from "@tanstack/react-query";
import { searchPromotionAddress } from "../api";

export const useSearchPromotionAddress = () => {
  return useMutation({
    mutationFn: searchPromotionAddress,
    onError: (error) => {
      console.error("주소 검색 중 에러:", error);
    },
  });
};


