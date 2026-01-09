'use client';
import dayjs from "dayjs";
import { memo, useEffect, useRef } from "react";

/**
 * 남은 시간을 분:초 형식으로 표시하는 패널 컴포넌트
 * @param timeString - 목표 시간 문자열 (ISO 8601 형식)
 */
export const TimeGapPannel = memo(({ timeString }: { timeString: string }) => {
  const minRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const diff = dayjs(timeString).diff(dayjs(), "seconds");
      const newMinutes = Math.floor(diff / 60);
      const newSeconds = diff % 60;

      // 현재 표시된 값과 비교
      const currentMinText = minRef.current?.textContent;
      const currentSecText = secRef.current?.textContent;
      const currentMinutes = currentMinText ? parseInt(currentMinText) ?? 0 : 0;
      const currentSeconds = currentSecText ? parseInt(currentSecText) ?? 0 : 0;

      // 분이 변경되었을 때 애니메이션 및 업데이트
      if (currentMinutes !== newMinutes) {
        if (minRef.current) {
          minRef.current.style.backgroundColor = "var(--color-grey-100)";
          minRef.current.style.transition = "var(--background) 0.2s ease-in-out";
          minRef.current.textContent = newMinutes.toString().padStart(2, "0");
          setTimeout(() => {
            if (minRef.current) {
              minRef.current.style.backgroundColor = "var(--background)";
            }
          }, 200);
        }
      }

      // 초가 변경되었을 때 애니메이션 및 업데이트
      if (currentSeconds !== newSeconds) {
        if (secRef.current) {
          secRef.current.style.backgroundColor = "var(--color-grey-100)";
          secRef.current.style.transition = "var(--background) 0.2s ease-in-out";
          secRef.current.textContent = newSeconds.toString().padStart(2, "0");
          setTimeout(() => {
            if (secRef.current) {
              secRef.current.style.backgroundColor = "var(--background)";
            }
          }, 200);
        }
      }
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row justify-center items-center gap-[8px]">
      <div className="flex flex-col items-center w-[64px]">
        <div
          ref={minRef}
          className="text-[28px] font-bold px-2 rounded"
        >
          {/* 초기값은 useEffect에서 설정 */}
        </div>
        <div className="text-[16px]">분</div>
      </div>

      <div className="flex flex-col items-center w-[64px]">
        <div
          ref={secRef}
          className="text-[28px] font-bold px-2 rounded"
        >
          {/* 초기값은 useEffect에서 설정 */}
        </div>
        <div className="text-[16px]">초</div>
      </div>
    </div>
  );
});

TimeGapPannel.displayName = 'TimeGapPannel';