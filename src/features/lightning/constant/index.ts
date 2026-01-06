// Bottom Sheet 레벨
export const LOW_LEVEL = 400;
export const MEDIUM_LEVEL = 172;
export const HIGH_LEVEL = 0;

// Bottom Sheet 제스처 설정
export const GESTURE_THRESHOLD = 60;
export const GESTURE_VELOCITY_THRESHOLD = 200;

// 번개 태그 목록
export const LIGHTNING_TAGS = ["새내기", "뒷풀이", "주체부터"] as const;

// 번개 모임 타입
export const LIGHTNING_MEETING_TYPE = {
  FREE: "FREE",
  PAN: "PAN",
} as const;

// 공개 범위
export const VISIBILITY_SCOPE = {
  ALL: "ALL",
  SCHOOL_ONLY: "SCHOOL_ONLY",
} as const;

// 번개 상태
export const LIGHTNING_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED",
  SUCCESS: "SUCCESS",
  READY: "READY",
} as const;