function toKST(date: Date): Date {
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + 9 * 60 * 60 * 1000);
}

export function formatRelativeDate(inputDate: Date): string {
  const now = toKST(new Date());
  const input = toKST(inputDate);

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const inputStart = new Date(
    input.getFullYear(),
    input.getMonth(),
    input.getDate()
  );

  const diffMs = now.getTime() - input.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  const isToday = inputStart.getTime() === todayStart.getTime();

  if (isToday) {
    if (diffMin < 1) {
      return "방금 전";
    }

    if (diffHour < 1) {
      return `${diffMin}분 전`;
    }

    const hour = input.getHours();
    const minute = input.getMinutes().toString().padStart(2, "0");
    const isAM = hour < 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${isAM ? "오전" : "오후"} ${formattedHour}:${minute}`;
  }

  const diffDateCount = Math.floor(
    (todayStart.getTime() - inputStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDateCount < 7) {
    return `${diffDateCount}일 전`;
  }

  const nowYear = now.getFullYear();
  const inputYear = input.getFullYear();
  const month = (input.getMonth() + 1).toString().padStart(2, "0");
  const date = input.getDate().toString().padStart(2, "0");

  if (nowYear !== inputYear) {
    return `${inputYear}년 ${month}월 ${date}일`;
  }

  return `${month}월 ${date}일`;
} 