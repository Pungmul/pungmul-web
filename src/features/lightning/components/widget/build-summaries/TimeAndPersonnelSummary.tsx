"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { useLightningBuildStoreApi } from "../../../contexts/LightningBuildStoreContext";
import { useLightningCreateStore } from "../../../store/lightningCreateStore";
import { SummaryToken } from "../../element/SummaryToken";

export const TimeAndPersonnelSummary = () => {
  const formData = useLightningCreateStore((state) => state.formData);
  const lightningType = formData.lightningType.slice(0, 2) || "유형";
  const store = useLightningBuildStoreApi();
  const setBuildStep = store.getState().setBuildStep;
  const location = formData.address ? formData.address : "내가 정한 위치";

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium text-grey-600 flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-1">
          어느 <span className="text-grey-700 font-bold">시간</span>까지{" "}
          <span className="text-grey-700 font-bold">몇 명</span>을
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            truncate
            icon={<MapPinIcon className="size-4 stroke-[1.5px] stroke-grey-500" />}
            onClick={() => setBuildStep("SelectLocation")}
          >
            {location}
          </SummaryToken>
          <span className="text-grey-600 shrink-0">{"에서"}</span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            onClick={() => setBuildStep("SelectType")}
          >
            {lightningType}{" "}
            <ChevronDownIcon className="size-4 stroke-[1.5px] stroke-grey-500" />
          </SummaryToken>
          <span className="text-secondary font-bold">번개<span className="font-medium text-grey-600">{"를"}</span></span>위해
          모아볼까요?
        </div>
      </h2>
    </div>
  );
};
