import { useState, useMemo, useCallback, useEffect } from "react";

export interface UseTimeInputProps {
  value?: string;
  onChange?: ((time: string) => void) | undefined;
  showSeconds?: boolean;
  showAmPm?: boolean;
  minTime?: string;
  maxTime?: string;
}

// 시간 유효성 검사 함수
const isValidTimeValue = (
  value: string,
  type: "hour" | "minute" | "second"
): boolean => {
  const num = parseInt(value, 10);
  if (isNaN(num)) return false;

  switch (type) {
    case "hour":
      return num >= 0 && num <= 23;
    case "minute":
    case "second":
      return num >= 0 && num <= 59;
    default:
      return false;
  }
};

// 시간 문자열을 파싱하는 함수 - AM/PM 지원 버전
const parseTimeString = (
  timeStr: string,
  showSeconds: boolean,
  showAmPm: boolean
) => {
  if (!timeStr) {
    return {
      hour: "00",
      minute: "00",
      second: showSeconds ? "00" : undefined,
      ampm: showAmPm ? "오전" : undefined,
    };
  }

  // 오전/오후가 포함된 경우 파싱
  const [hours, minutes, seconds] = timeStr.split(":");

  if (!hours || !minutes) {
    return {
      hour: "00",
      minute: "00",
      second: showSeconds ? "00" : undefined,
      ampm: showAmPm ? "오전" : undefined,
    };
  }

  if (showAmPm) {
    const ampm = Number(hours) >= 12 ? "오후" : "오전";
    let formattedHour =
      ampm === "오후" && Number(hours) !== 12
        ? Number(hours) - 12
        : Number(hours);

    if (ampm === "오전" && formattedHour === 0) {
      formattedHour = 12;
    }

    return {
      hour: formattedHour.toString().padStart(2, "0"),
      minute: minutes?.padStart(2, "0") || "00",
      second: showSeconds ? seconds?.padStart(2, "0") || "00" : undefined,
      ampm: ampm,
    };
  }

  return {
    hour: hours.padStart(2, "0"),
    minute: minutes.padStart(2, "0"),
    second: showSeconds ? seconds?.padStart(2, "0") || "00" : undefined,
  };
};

// 시간 객체를 문자열로 변환하는 함수 - ISO 형식 HH:mm
const formatTimeString = (
  time: {
    hour: string;
    minute: string;
    second?: string | undefined;
    ampm?: string | undefined;
  },
  showSeconds: boolean,
  showAmPm: boolean
): string => {
  let hour24 = parseInt(time.hour, 10);

  // 12시간 형식을 24시간 형식으로 변환
  if (showAmPm && time.ampm) {
    if (time.ampm === "오후" && hour24 !== 12) {
      hour24 += 12;
    } else if (time.ampm === "오전" && hour24 === 12) {
      hour24 = 0;
    }
  }

  const hour24Str = hour24.toString().padStart(2, "0");
  let timeStr = "";

  if (showSeconds && time.second !== undefined) {
    timeStr = `${hour24Str}:${time.minute}:${time.second}`;
  } else {
    timeStr = `${hour24Str}:${time.minute}`;
  }

  return timeStr;
};

export function useTimeInput({
  value,
  onChange,
  showSeconds = false,
  showAmPm = false,
  minTime = "",
  maxTime = "",
}: UseTimeInputProps) {
  // 현재 타이핑 중인 시간 (valid하지 않아도 저장)
  const [typeTime, setTypeTime] = useState(
    parseTimeString(value || "", showSeconds, showAmPm) || ""
  );

  // 현재 표시할 시간 값들 (타이핑 중이면 typeTime, 아니면 value)
  const displayTime = useMemo(() => {
    return typeTime || parseTimeString(value || "", showSeconds, showAmPm);
  }, [typeTime, value]);
  // 현재 시간이 유효한지 확인 - currentTime을 재사용하여 최적화
  const isValidTime = useMemo(() => {
    if (!displayTime) return true;

    // AM/PM 모드에서는 시간 범위가 1-12
    const hourRange = showAmPm ? { min: 1, max: 12 } : { min: 0, max: 23 };
    const hourNum = parseInt(displayTime.hour, 10);
    const isValidHour =
      !isNaN(hourNum) && hourNum >= hourRange.min && hourNum <= hourRange.max;

    return (
      isValidHour &&
      isValidTimeValue(displayTime.minute, "minute") &&
      (showSeconds
        ? isValidTimeValue(displayTime.second || "00", "second")
        : true)
    );
  }, [displayTime, showSeconds, showAmPm]);

  // value 변경시 타이핑 상태 초기화
  useEffect(() => {
    setTypeTime(parseTimeString(value || "", showSeconds, showAmPm) || "");
  }, [value]);

  // 각 필드의 값 업데이트 - AM/PM 지원 버전
  const updateFieldValue = useCallback(
    (field: "hour" | "minute" | "second" | "ampm", newValue: string) => {
      const updatedTime = { ...displayTime, [field]: newValue };

      // 오전/오후 변경 시 시간도 조정

      if (field !== "ampm") {
        updatedTime[field] = newValue.padStart(2, "0");
      }

      const newTimeString = formatTimeString(
        updatedTime,
        showSeconds,
        showAmPm
      );

      let newTime;

      if (minTime && newTimeString < minTime) {
        newTime = parseTimeString(minTime, showSeconds, showAmPm);
      } else if (maxTime && newTimeString > maxTime) {
        newTime = parseTimeString(maxTime, showSeconds, showAmPm);
      } else {
        newTime = parseTimeString(newTimeString, showSeconds, showAmPm);
      }

      // 타이핑 중인 시간 업데이트 (valid하지 않아도 저장)
      setTypeTime(newTime);

      // 유효한 시간일 때만 onChange 호출
      const hourRange = showAmPm ? { min: 1, max: 12 } : { min: 0, max: 23 };
      const hourNum = parseInt(updatedTime.hour, 10);
      const isValidHour =
        !isNaN(hourNum) && hourNum >= hourRange.min && hourNum <= hourRange.max;

      const isValid =
        isValidHour &&
        isValidTimeValue(updatedTime.minute, "minute") &&
        (showSeconds
          ? isValidTimeValue(updatedTime.second || "00", "second")
          : true);

      if (isValid) {
        onChange?.(newTimeString);
      }
    },
    [displayTime, onChange, showSeconds, showAmPm]
  );

  const handleFieldInput = useCallback(
    (
      type: "hour" | "minute" | "second" | "ampm",
      inputText: string
    ): string => {
      // 오전/오후 필드 처리 - 토글 방식
      if (type === "ampm") {
        const upperInput = inputText.toUpperCase();
        if (upperInput === "A" || upperInput === "오전") {
          updateFieldValue("ampm", "오전");
          return "오전";
        } else if (upperInput === "P" || upperInput === "오후") {
          updateFieldValue("ampm", "오후");
          return "오후";
        }
        // 기본적으로 현재 값과 반대로 토글
        const currentAmPm = displayTime.ampm || "오전";
        const newAmPm = currentAmPm === "오전" ? "오후" : "오전";
        updateFieldValue("ampm", newAmPm);
        return newAmPm;
      }

      // If input is empty, clear the field
      if (!inputText) {
        updateFieldValue(type, "00");
        return "00";
      }

      // If input is a single digit, pad with zero
      if (inputText.length === 1) {
        const paddedValue = inputText.padStart(2, "0");
        updateFieldValue(type, paddedValue);
        return paddedValue;
      }

      // If input is two digits, use as is
      if (inputText.length === 2) {
        updateFieldValue(type, inputText);
        return inputText;
      }

      // If input is longer than 2 digits, take the last 2
      const lastTwo = inputText.slice(-2);
      updateFieldValue(type, lastTwo);
      return lastTwo;
    },
    [updateFieldValue, displayTime.ampm]
  );

  return {
    isValidTime,
    displayTime,
    handleFieldInput,
    setTypeTime,
  };
}
