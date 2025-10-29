// Lightning Query Keys
export const lightningQueryKeys = {
  all: ["lightning"] as const,
  status: () => [...lightningQueryKeys.all, "status"] as const,
  lightningList: () => ["lightning", "list"] as const,
} as const;

export const locationQueryKeys = {
  userLocation: () => ["location", "user"] as const,
} as const;

export const lightningDataQueryKeys = {
  lightningData: () => ["lightning-data"] as const,
} as const;
