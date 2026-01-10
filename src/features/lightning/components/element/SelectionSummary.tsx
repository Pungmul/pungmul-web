"use client";

import { useMemo } from "react";

import { useLightningBuildStore } from "../../contexts/LightningBuildStoreContext";
import {
  FinalSummary,
  LocationSummary,
  TargetSummary,
  TimeAndPersonnelSummary,
  TypeSummary,
} from "../widget/build-summaries";

export const SelectionSummary = () => {
  const buildStep = useLightningBuildStore((state) => state.buildStep);

  const SummaryItem = useMemo(() => {
    switch (buildStep) {
      case "SelectType":
        return <TypeSummary />;
      case "SelectLocation":
        return <LocationSummary />;
      case "SelectTimeAndPersonnel":
        return <TimeAndPersonnelSummary />;
      case "SelectTarget":
        return <TargetSummary />;
      case "Summary":
        return <FinalSummary />;
      default:
        return null;
    }
  }, [buildStep]);

  return <div className="px-6 py-4">{SummaryItem}</div>;
};
