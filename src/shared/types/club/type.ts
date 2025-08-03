// Club Types

export type Club = "어흥" | "떼" | "하날다래" | "악반" | "푸른소래" | null;

export interface ClubInfo {
  id: number;
  name: Club;
  description?: string;
  memberCount: number;
}
