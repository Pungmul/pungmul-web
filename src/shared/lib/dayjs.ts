import dayjs from "dayjs";
import 'dayjs/locale/ko';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Seoul");

export const dayConfig = {
  format: "YYYY년 M월 D일 (ddd)",
  formatWithTime: "YYYY년 M월 D일 dddd H시 m분",
};

export const getDateString= (date: string) => {
  return dayjs(date).format(dayConfig.format);
};

export const getDateStringWithTime = (date: string) => {
  return dayjs(date).format(dayConfig.formatWithTime);
}; 