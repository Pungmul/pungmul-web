import { PromotionManagePage } from "@/features/promote";

export const dynamic = "force-dynamic";

export default function PromotionManage() {
  return (
    <div className="w-full bg-grey-100">
      <div className="relative w-full min-h-dvh md:max-w-[768px] h-full mx-auto bg-background">
        <PromotionManagePage key="promotion-manage-page" />
      </div>
    </div>
  );
}
