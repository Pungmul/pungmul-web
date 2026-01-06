// Lightning Query Keys - 통합된 구조
export const lightningQueryKeys = {
  all: ["lightning"] as const,
  lists: () => [...lightningQueryKeys.all, "list"] as const,
  list: (filters?: { target?: string }) =>
    filters
      ? ([...lightningQueryKeys.lists(), filters] as const)
      : lightningQueryKeys.lists(),
  data: () => [...lightningQueryKeys.all, "data"] as const,
  status: () => [...lightningQueryKeys.all, "status"] as const,
  // 하위호환을 위해 유지
  lightningList: () => lightningQueryKeys.lists(),
} as const;

export const locationQueryKeys = {
  all: ["location"] as const,
  userLocation: () => [...locationQueryKeys.all, "user"] as const,
} as const;

/**
 * @deprecated lightningQueryKeys.data()를 사용하세요
 */
export const lightningDataQueryKeys = {
  lightningData: () => lightningQueryKeys.data(),
} as const;
