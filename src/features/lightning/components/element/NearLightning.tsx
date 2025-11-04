"use client";
import { NearLightningContent } from "../widget/NearLightningContent";

export default function NearLightning() {
  return (
    <section className="flex flex-col relative gap-[20px]">
      <h2 className="flex flex-row items-end px-[24px] text-[18px] font-bold">
        근처에서 생긴 번개
      </h2>

      <NearLightningContent />
    </section>
  );
}
