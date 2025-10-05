import { Suspense } from "react";
import { PromotionPostingPage } from "@/features/promote";
import { Spinner } from "@/shared";

export const metadata = {
  title: "풍덩 | 공연 등록",
};

export default function PromotionFormPage() {
  return (
    <div className="w-full bg-grey-100">
      <div className="relative w-full min-h-dvh md:max-w-[768px] h-full mx-auto bg-background">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-background">
              <Spinner size={32} />
            </div>
          }
        >
          <PromotionPostingPage key="board-posting-page" />
        </Suspense>
      </div>
    </div>
  );
}
