import { createStore } from "zustand";

export const BUILD_STEPS = [
  "SelectType",
  "SelectLocation",
  "SelectTimeAndPersonnel",
  "SelectTarget",
  "Summary",
  "Pending",
  "Completed",
] as const;

export type BuildStep = (typeof BUILD_STEPS)[number];

export interface LightningBuildState {
  buildStep: BuildStep;
  setBuildStep: (step: BuildStep) => void;
}

export const createLightningBuildStore = () =>
  createStore<LightningBuildState>((set) => ({
    buildStep: "SelectType",
    setBuildStep: (step) => set({ buildStep: step }),
  }));
