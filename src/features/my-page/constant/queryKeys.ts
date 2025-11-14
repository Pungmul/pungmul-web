export const myPageQueryKeys = {
  all: ["my-page"] as const,
  info: () => [...myPageQueryKeys.all, "info"] as const,
  instrumentSkill: () => [...myPageQueryKeys.all, "instrument-skill"] as const,
};

