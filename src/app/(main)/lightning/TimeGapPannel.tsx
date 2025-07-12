import dayjs from "@/shared/lib/dayjs";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

export const TimeGapPannel = ({ timeString }: { timeString: string }) => {

  const [min, sec] = useMemo(
    () => {
      const diff = dayjs(timeString).diff(dayjs(), "seconds");
      return [Math.floor(diff / 60), diff % 60];
    },
    [timeString]
  );
  const [minutes, setMinutes] = useState(Number(min));
  const [seconds, setSeconds] = useState(Number(sec));

  const [minBg, setMinBg] = useState("#ffffff");
  const [secBg, setSecBg] = useState("#ffffff");

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = dayjs(timeString).diff(dayjs(), "seconds");
      setMinutes(Math.floor(diff / 60));
      setSeconds(diff % 60);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeString]);

  // 초 애니메이션 트리거
  useEffect(() => {
    setSecBg("#d1d5db");
    const timeout = setTimeout(() => setSecBg("#ffffff"), 200);
    return () => clearTimeout(timeout);
  }, [seconds]);

  // 분 애니메이션 트리거
  useEffect(() => {
    setMinBg("#d1d5db");
    const timeout = setTimeout(() => setMinBg("#ffffff"), 200);
    return () => clearTimeout(timeout);
  }, [minutes]);

  return (
    <div className="flex flex-row justify-center items-center gap-[8px]">
      <div className="flex flex-col items-center w-[64px]">
        <motion.div
          animate={{ backgroundColor: minBg }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="text-[28px] font-bold px-2 rounded"
        >
          {minutes.toString().padStart(2, "0")}
        </motion.div>
        <div className="text-[16px]">분</div>
      </div>

      <div className="flex flex-col items-center w-[64px]">
        <motion.div
          animate={{ backgroundColor: secBg }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="text-[28px] font-bold px-2 rounded"
        >
          {seconds.toString().padStart(2, "0")}
        </motion.div>
        <div className="text-[16px]">초</div>
      </div>
    </div>
  );
};
