import { describe, it, expect } from "vitest";
import type { LightningMeeting } from '../../types';
import { filterLightningList } from "../filterLightningList";

describe("lightningUtils", () => {
  const mockLightningList: LightningMeeting[] = [
    {
      id: 1,
      latitude: 37.5665,
      longitude: 126.9780,
      meetingName: "번개 1",
      maxPersonNum: 10,
      minPersonNum: 5,
      startTime: "2024-01-01T00:00:00Z",
      endTime: "2024-01-01T02:00:00Z",
      recruitmentEndTime: "2024-01-01T00:00:00Z",
      meetingType: "FREE",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      organizerId: 1,
      buildingName: "건물 1",
      locationDetail: "상세 위치 1",
      tags: [],
      lightningMeetingParticipantList: [],
      instrumentAssignmentList: [],
      status: "OPEN",
      notificationSent: false,
      visibilityScope: "ALL",
    },
    {
      id: 2,
      latitude: 37.5665,
      longitude: 126.9780,
      meetingName: "번개 2",
      maxPersonNum: 8,
      minPersonNum: 3,
      startTime: "2024-01-01T01:00:00Z",
      endTime: "2024-01-01T03:00:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      organizerId: 2,
      buildingName: "건물 2",
      locationDetail: "상세 위치 2",
      tags: [],
      lightningMeetingParticipantList: [],
      instrumentAssignmentList: [],
      status: "OPEN",
      notificationSent: false,
      visibilityScope: "ALL",
      recruitmentEndTime: "2024-01-01T00:00:00Z",
      meetingType: "FREE",
    },
  ];

  const mockSchoolLightningList: LightningMeeting[] = [
    {
      id: 3,    
      latitude: 37.5665,
      longitude: 126.9780,
      meetingName: "학교 번개",
      maxPersonNum: 6,
      minPersonNum: 2,
      startTime: "2024-01-01T02:00:00Z",
      endTime: "2024-01-01T04:00:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      organizerId: 3,
      buildingName: "건물 3",
      locationDetail: "상세 위치 3",
      tags: [],
      lightningMeetingParticipantList: [],
      instrumentAssignmentList: [],
      status: "OPEN",
      notificationSent: false,
      visibilityScope: "ALL",
      recruitmentEndTime: "2024-01-01T00:00:00Z",
      meetingType: "FREE",
    },
  ];

  describe("filterLightningList", () => {
    it("전체 타겟일 때 전체 번개 리스트를 반환한다", () => {
      const result = filterLightningList("전체", mockLightningList, mockSchoolLightningList);
      expect(result).toEqual(mockLightningList);
    });

    it("우리학교 타겟일 때 학교 번개 리스트를 반환한다", () => {
      const result = filterLightningList("우리학교", mockLightningList, mockSchoolLightningList);
      expect(result).toEqual(mockSchoolLightningList);
    });

    it("빈 리스트를 올바르게 처리한다", () => {
      const result = filterLightningList("전체", [], []);
      expect(result).toEqual([]);
    });
  });
});
