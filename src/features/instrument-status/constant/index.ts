import type { Instrument, InstrumentAbility } from "../types";

export const instruments: Instrument[] = [
  "KKWAENGGWARI",
  "JING",
  "JANGGU",
  "BUK",
  "SOGO",
  "TAEPYUNGSO",
];

export const instrumentNamesMap: Record<Instrument, string> = {
  KKWAENGGWARI: "꽹과리",
  JING: "징",
  JANGGU: "장구",
  BUK: "북",
  SOGO: "소고",
  TAEPYUNGSO: "태평소",
};

export const instrumentAbilities: InstrumentAbility[] = [
  "UNSKILLED",
  "INTERMEDIATE",
  "EXPERT",
];

export const abilityNamesMap: Record<InstrumentAbility, string> = {
  UNSKILLED: "초심자",
  INTERMEDIATE: "중급자",
  EXPERT: "전문가",
};


