"use client";

import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";

import { useLightningBuildStoreApi } from "../../../contexts/LightningBuildStoreContext";
import { useLightningCreateStore } from "../../../store/lightningCreateStore";
import { SummaryToken } from "../../element/SummaryToken";

export const FinalSummary = () => {
  const formData = useLightningCreateStore((state) => state.formData);
  const location = formData.address ? formData.address : "내가 정한 위치";
  const lightningType = formData.lightningType.slice(0, 2) || "유형";
  const time = formData.recruitEndTime || dayjs().add(5, "minute").format("HH:mm");
  const target = formData.target || "전체";
  const store = useLightningBuildStoreApi();
  const setBuildStep = store.getState().setBuildStep;

  const minPersonnel = formData.minPersonnel;
  const maxPersonnel = formData.maxPersonnel;
  
  return (
    <div className="space-y-2">
      <h2 className="text-lg flex flex-col gap-1 text-grey-600">
        <div className="flex items-center gap-1">
          <SummaryToken onClick={() => setBuildStep("SelectTarget")}>
            {target}
          </SummaryToken>
          <span>에게</span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            icon={<MapPinIcon className="size-4 stroke-[1.5px] stroke-grey-500" />}
            onClick={() => setBuildStep("SelectLocation")}
            truncate
          >
            {location}
          </SummaryToken>
          <span className="text-grey-600 shrink-0">{"에서"}</span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken onClick={() => setBuildStep("SelectType")}>
            {lightningType}{" "}
            <ChevronDownIcon className="size-4 stroke-[1.5px] stroke-grey-500" />
          </SummaryToken>
          <span className="text-secondary font-bold">번개<span className="font-medium text-grey-600">{"를"}</span></span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            icon={<UserGroupIcon className="size-4 stroke-[1.5px] fill-grey-500" />}
            onClick={() => setBuildStep("SelectTimeAndPersonnel")}
            className="tracking-widest"
          >
            {minPersonnel}~{maxPersonnel}명
          </SummaryToken>
          <span>과 함께 갖자고</span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            icon={<ClockIcon className="size-4 stroke-[1.5px] stroke-grey-500" />}
            onClick={() => setBuildStep("SelectTimeAndPersonnel")}
            className="tracking-widest"
          >
            {time}
          </SummaryToken>
          <span>까지 물어볼까요?</span>
        </div>
      </h2>
    </div>
  );
};
