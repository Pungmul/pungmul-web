"use client";
import { usePromotionList } from "../../queries";
import { PromotionPostBox, PromotionPostBoxSkeleton } from "../element";

export function PromotionList() {
  const { data: promotionList, isLoading } = usePromotionList();

  return (
    <ul className="relative grid grid-cols-2 md:grid-cols-3 gap-[12px] w-full bg-background px-[24px] md:px-0 list-none">
      {isLoading || !promotionList ? (
        <PromotionPostBoxSkeleton length={9} />
      ) : (
        promotionList.map((promotion) => (
          <PromotionPostBox promotion={promotion} key={promotion.publicKey} />
        ))
      )}
    </ul>
  );
}
