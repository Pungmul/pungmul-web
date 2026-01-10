import { z } from "zod";

export const lightningCreateSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  minPersonnel: z.number().min(1, "최소 인원은 1명 이상이어야 합니다").max(10, "최대 10명까지 가능합니다"),
  maxPersonnel: z.number().min(1, "최대 인원은 1명 이상이어야 합니다").max(20, "최대 20명까지 가능합니다"),
  lightningType: z.enum(["일반 모임", "풍물 모임"]),
  recruitEndTime: z.string().min(1, "모집 종료 시간을 선택해주세요"),
  address: z.string().min(1, "주소를 선택해주세요"),
  detailAddress: z.string().optional(),
  locationPoint: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).nullable(),
  target: z.enum(["우리 학교만", "전체"]),
  tagList: z.array(z.string()).max(5, "태그는 최대 5개까지 가능합니다"),
  startTime: z.string().min(1, "시작 시간을 선택해주세요"),
  endTime: z.string().min(1, "종료 시간을 선택해주세요"),
}).refine((data) => {
  // 시작 시간이 종료 시간보다 빠른지 검증
  if (data.startTime && data.endTime) {
    const start = new Date(`2000-01-01T${data.startTime}`);
    const end = new Date(`2000-01-01T${data.endTime}`);
    return end > start;
  }
  return true;
}, {
  message: "종료 시간은 시작 시간보다 늦어야 합니다",
  path: ["endTime"],
}).refine((data) => {
  // 최소 인원이 최대 인원보다 작거나 같은지 검증
  return data.minPersonnel <= data.maxPersonnel;
}, {
  message: "최소 인원은 최대 인원보다 작거나 같아야 합니다",
  path: ["minPersonnel"],
});

export type LightningCreateFormData = z.infer<typeof lightningCreateSchema>;
