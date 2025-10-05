"use client";
import { useMemo, useState } from "react";
import { useMyPromotionFormList } from "../../queries";
import {
  MyPromotionPostBox,
  AddNewPromotionPostBox,
  PromotionPostBoxSkeleton,
} from "../element";
import { ChipButton, Space } from "@pThunder/shared";

type SelectedTab = "DRAFT" | "OPEN";

export function MyPromotionFormList() {
  const { data: promotionFormList, isLoading } = useMyPromotionFormList();
  const [selectedTab, setSelectedTab] = useState<SelectedTab>("DRAFT");
  const { draft, published } = useMemo(() => {
    return {
      draft: promotionFormList?.filter((form) => form.status === "DRAFT"),
      published: promotionFormList?.filter((form) => form.status === "OPEN"),
    };
  }, [promotionFormList]);
  const selectedPromotionFormList = useMemo(() => {
    return selectedTab === "DRAFT" ? draft : published;
  }, [selectedTab, draft, published]);

  return (
    <>
      <div className="flex flex-row gap-2 w-full px-2 sticky top-16 h-9 z-10 bg-background">
        <ChipButton
          filled={selectedTab === "OPEN"}
          onClick={() => setSelectedTab("OPEN")}
        >
          모집중인 공연
        </ChipButton>
        <ChipButton
          filled={selectedTab === "DRAFT"}
          onClick={() => setSelectedTab("DRAFT")}
        >
          작성중
        </ChipButton>
      </div>
      <Space className="bg-background h-4 sticky top-[6.25rem] z-10" />
      <ul className="relative grid grid-cols-2 md:grid-cols-3 gap-[12px] w-full bg-background px-[24px] md:px-0 list-none">
        {isLoading || !selectedPromotionFormList ? (
          <PromotionPostBoxSkeleton length={3} />
        ) : (
          <>
            <AddNewPromotionPostBox />
            {selectedPromotionFormList.map((form) => (
              <MyPromotionPostBox form={form} key={form.id} />
            ))}
          </>
        )}
      </ul>
    </>
  );
}
