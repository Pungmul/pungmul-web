import { Instrument, InstrumentAbility } from "./type";

const instruments: Instrument[] = [
  "KKWAENGGWARI",
  "JING",
  "JANGGU",
  "BUK",
  "SOGO",
  "TAEPYUNGSO",
];

const instrumentNamesMap: Record<Instrument, string> = {
  KKWAENGGWARI: "꽹과리",
  JING: "징",
  JANGGU: "장구",
  BUK: "북",
  SOGO: "소고",
  TAEPYUNGSO: "태평소",
};

const instrumentAbilities: InstrumentAbility[] = [
  "UNSKILLED",
  // "BASIC",
  "INTERMEDIATE",
  // "ADVANCED",
  "EXPERT",
];

const abilityNamesMap: Record<InstrumentAbility, string> = {
  UNSKILLED: "초심자",
  // BASIC: "초급자",
  INTERMEDIATE: "중급자",
  // ADVANCED: "숙련자",
  EXPERT: "전문가",
};

export { instruments, instrumentNamesMap, instrumentAbilities, abilityNamesMap };