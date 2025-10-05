"use client";
import { useCallback } from "react";
import { Space, Conditional } from "@/shared";
import { PromotionMainTabs } from "./PromotionMainTabs";
import { MyPromotionFormList } from "./MyPromotionFormList";
import { PromotionList } from "./PromotionList";
import { PROMOTION_TABS } from "../../constant";
import { useSearchParams, useRouter } from "next/navigation";

export function PromotePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") ?? PROMOTION_TABS[0]!.value;
  const selectedTab = PROMOTION_TABS.find((t) => t.value === tab)!;

  const handleTabChange = useCallback(
    (tab: TabItem) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab.value);
      window.history.pushState(
        null,
        "",
        `/board/promote/l?${params.toString()}`
      );
      // router.push(`/board/promote/l?${params.toString()}`);
    },
    [searchParams, router]
  );

  return (
    <div className="w-full flex flex-col">
      <PromotionMainTabs
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
      />
      <Space className="bg-background h-4 sticky top-12 z-20" />
      <Conditional
        value={selectedTab.value}
        cases={{
          "my-promotion-form-list": <MyPromotionFormList />,
          "promotion-list": <PromotionList />,
        }}
      />
    </div>
  );
}
