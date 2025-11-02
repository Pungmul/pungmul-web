export type InstrumentAbility = "UNSKILLED" | "INTERMEDIATE" | "EXPERT";

export type Instrument =
  | "KKWAENGGWARI"
  | "JING"
  | "JANGGU"
  | "BUK"
  | "SOGO"
  | "TAEPYUNGSO";

export interface InstrumentStatus {
  instrument: Instrument;
  instrumentAbility: InstrumentAbility;
  major: boolean;
}


