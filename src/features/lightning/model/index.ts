import { Instrument } from "../../instrument-status/model/index";

export const LIGHTNING_TAGS = ["새내기", "뒷풀이", "주체부터"] as const;

export interface LightningMeetingMessage {
  messageLogId: number;
  domainType: "LIGHTNING_MEETING"; // string literal로 고정
  businessIdentifier: string;
  identifier: string | null;
  stompDest: string;
  content: LightningMeeting[];
}

export interface LightningMeeting {
  id: number;
  meetingName: string;
  recruitmentEndTime: string; // ISO 날짜 문자열
  startTime: string;
  endTime: string;
  minPersonNum: number;
  maxPersonNum: number;
  organizerId: number;
  meetingType: "FREE" | "PLAY" | "STUDY" | string; // 다른 타입이 있을 수 있으므로 string 포함
  latitude: number;
  longitude: number;
  buildingName: string;
  locationDetail: string;
  tags: (typeof LIGHTNING_TAGS)[number][];
  lightningMeetingParticipantList: unknown[]; // 타입이 정의되지 않아 any[]로 처리
  instrumentAssignmentList: unknown[]; // 타입이 정의되지 않아 any[]로 처리
  status: "OPEN" | "CLOSED" | "CANCELLED" | "SUCCESS" | "READY";
  notificationSent: boolean;
  visibilityScope: "ALL" | "PRIVATE" | string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
}

export type InstrumentAssignRequestDTO<T extends Instrument> = {
  instrument: T;
  minPersonNum: number;
  maxPersonNum: number;
};

export type InstrumentAssignRequestDTOList = [
  InstrumentAssignRequestDTO<"KKWAENGGWARI">,
  InstrumentAssignRequestDTO<"JING">,
  InstrumentAssignRequestDTO<"JANGGU">,
  InstrumentAssignRequestDTO<"BUK">,
  InstrumentAssignRequestDTO<"SOGO">,
  InstrumentAssignRequestDTO<"TAEPYUNGSO">
];

export type CreateLightningMeetingRequest =
  | {
      meetingName: string;
      recruitmentEndTime: string; // ISO 문자열, 빈 문자열도 가능
      startTime: string;
      endTime: string;
      minPersonNum: number;
      maxPersonNum: number;
      meetingType: "FREE";
      latitude: number;
      longitude: number;
      buildingName: string;
      locationDetail: string;
      visibilityScope: "ALL" | "SCHOOL_ONLY";
      tags: string[]; // 태그 이름만 배열로 전달
    }
  | {
      meetingName: string;
      recruitmentEndTime: string; // ISO 문자열, 빈 문자열도 가능
      startTime: string;
      endTime: string;
      minPersonNum: number;
      maxPersonNum: number;
      meetingType: "PAN";
      latitude: number;
      longitude: number;
      buildingName: string;
      locationDetail: string;
      visibilityScope: "ALL" | "SCHOOL_ONLY";
      tags: string[]; // 태그 이름만 배열로 전달
      // instrumentAssignRequestDTOList: InstrumentAssignRequestDTOList;
    };


export type NearLightning = {
  distanceInMeters: number;
  lightningMeeting: LightningMeeting;
  organizerName: string;
}; 