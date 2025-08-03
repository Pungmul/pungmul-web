export const PostReportTypes = {
  SPAM: "스팸",
  ABUSE: "욕설/비방",
  INAPPROPRIATE: "부적절한 내용",
  OTHER: "기타",
  INCITING_TROUBLE: "분란 조장",
  PORNOGRAPHY: "음란물",
  DEFAMATION: "특정인 비방",
  OFF_TOPIC: "주제에 맞지 않는 게시물",
} as const;

export type PostReportType = keyof typeof PostReportTypes; 