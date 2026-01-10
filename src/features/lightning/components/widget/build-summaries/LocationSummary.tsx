"use client";

import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { useLightningBuildStoreApi } from "../../../contexts/LightningBuildStoreContext";
import { useLightningCreateStore } from "../../../store/lightningCreateStore";
import { SummaryToken } from "../../element/SummaryToken";

export const LocationSummary = () => {
  const formData = useLightningCreateStore((state) => state.formData);
  const lightningType = formData.lightningType.slice(0, 2) || "유형";
  const store = useLightningBuildStoreApi();
  const setBuildStep = store.getState().setBuildStep;
  
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold flex items-center text-grey-600 flex-wrap">
        <span>
          어느 <span className="text-grey-800">위치</span>에{" "}
        </span>
        <SummaryToken
          onClick={() => setBuildStep("SelectType")}
          className="mx-1"
        >
          {lightningType}{" "}<ChevronDownIcon className="size-4 stroke-[1.5px] stroke-grey-500" />
        </SummaryToken>
        <span className="text-secondary mr-1">번개<span className="text-grey-600">{"를"}</span> </span>만들까요?
      </h2>
    </div>
  );
};
