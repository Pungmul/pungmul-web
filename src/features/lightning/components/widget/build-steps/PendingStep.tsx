"use client";

import { Spinner } from "@/shared";

export const PendingStep = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner />
      <p className="mt-4 text-grey-600">번개를 생성하고 있습니다...</p>
    </div>
  );
};
