export interface InstrumentStatus {
    instrument: Instrument; //InstrumentEnum
    instrumentAbility: InstrumentAbility;
    major: boolean;
  }
  
  export type InstrumentAbility = "UNSKILLED" | "INTERMEDIATE" | "EXPERT";

  export type Instrument =
  | "KKWAENGGWARI"
  | "JING"
  | "JANGGU"
  | "BUK"
  | "SOGO"
  | "TAEPYUNGSO"; 