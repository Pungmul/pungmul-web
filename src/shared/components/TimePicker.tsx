import { useEffect, useMemo, useState } from "react";
import { Modal } from "./ui";
import dayjs from "dayjs";

interface TimePickerProps {
  trigger: React.ReactNode;
  onChange: (startTime: string, endTime: string) => void;
  value: {
    startTime: string;
    endTime: string;
  };
}

export default function TimePicker({
  trigger,
  onChange,
  value,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { startTime: oldStartTime, endTime: oldEndTime } = value;
  const [startTime, setStartTime] = useState<string>(oldStartTime);
  const [endTime, setEndTime] = useState<string>(oldEndTime);

  const [isOnSelect, setIsOnSelect] = useState<"startTime" | "endTime" | null>(
    oldStartTime.trim() ? (oldEndTime.trim() ? null : "endTime") : "startTime"
  );

  const nowTime = useMemo(() => dayjs().format("HH:mm"), []);

  console.log(Number(nowTime.split(":")[0]));
  const handleChange = (startTime: string, endTime: string) => {
    setStartTime(startTime);
    setEndTime(endTime);
    onChange(startTime, endTime);
    setIsOpen(false);
  };

  useEffect(() => {
    setStartTime(oldStartTime);
    setEndTime(oldEndTime);
  }, [oldStartTime, oldEndTime]);

  useEffect(() => {
    if (startTime.trim() && endTime.trim()) {
      setIsOnSelect(null);
    } else if (startTime.trim()) {
      setIsOnSelect("endTime");
    } else if (endTime.trim()) {
      setIsOnSelect("startTime");
    } else {
      setIsOnSelect("startTime");
    }
  }, [startTime, endTime]);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} hasHeader={false}>
        <div className="flex flex-col h-[420px]">
          <div className="flex flex-row justify-end">
            <button
              className="text-[#816DFF] py-[8px] px-[16px] rounded-md"
              onClick={() => {
                setStartTime("");
                setEndTime("");
              }}
            >
              초기화
            </button>
          </div>
          <div className="flex flex-col gap-[4px] flex-grow justify-center overflow-hidden py-[16px]">
            <div
              className={
                "flex flex-row justify-between items-center px-[16px] py-[8px] cursor-pointer hover:bg-[#eee] rounded-md  " +
                (isOnSelect === "startTime" ? " bg-[#eee]" : "")
              }
              onClick={() => {
                if (isOnSelect === "startTime") {
                  setIsOnSelect(null);
                } else {
                  setIsOnSelect("startTime");
                }
              }}
            >
              <div>시작시간</div>
              <div className="text-right text-[#816DFF]">
                {startTime.trim()
                  ? startTime
                      .split(":")
                      .map((v, i) => (i === 0 ? v.padStart(2, "0") : v))
                      .join(":")
                  : "*"}
              </div>
            </div>
            <div
              className={
                "block overflow-y-auto border border-[#e0dcff] rounded-md flex-grow" +
                (isOnSelect === "startTime" ? " flex-grow" : " hidden")
              }
            >
              <ul className="flex flex-col gap-2 list-none px-[16px] py-[16px]  justify-center">
                {Array.from({ length: 24 }, (_, i) =>
                  (i < Number(endTime.split(":")[0]) || !endTime.trim()) &&
                  i > Number(nowTime.split(":")[0]) ? (
                    <li
                      key={"start-time-" + i}
                      onClick={() => setStartTime(`${i}:00`)}
                      className={`hover:bg-[#e0dcff] py-[8px] rounded-md cursor-pointer text-center ${
                        startTime === `${i}:00` ? "text-[#816DFF]" : ""
                      }`}
                    >
                      {i.toString().padStart(2, "0")}:00
                    </li>
                  ) : null
                )}
              </ul>
            </div>

            <div
              className={
                "flex flex-row justify-between items-center px-[16px] py-[8px] cursor-pointer hover:bg-[#eee] rounded-md  " +
                (isOnSelect === "endTime" ? " bg-[#eee]" : "")
              }
              onClick={() => {
                if (isOnSelect === "endTime") {
                  setIsOnSelect(null);
                } else {
                  setIsOnSelect("endTime");
                }
              }}
            >
              <div>종료시간</div>
              <div className="text-right text-[#816DFF]">
                {endTime.trim()
                  ? endTime
                      .split(":")
                      .map((v, i) => (i === 0 ? v.padStart(2, "0") : v))
                      .join(":")
                  : "*"}
              </div>
            </div>
            <div
              className={
                "block overflow-y-auto border border-[#e0dcff] rounded-md flex-grow" +
                (isOnSelect === "endTime" ? " flex-grow" : " hidden")
              }
            >
              <ul className="flex flex-col gap-2 list-none px-[16px] py-[16px] border border-[#ddd] rounded-md justify-center">
                {Array.from({ length: 24 }, (_, i) =>
                  (i > Number(startTime.split(":")[0]) || !startTime.trim()) &&
                  i > Number(nowTime.split(":")[0]) ? (
                    <li
                      key={"end-time-" + i}
                      onClick={() => setEndTime(`${i}:00`)}
                      className={`hover:bg-[#e0dcff]  py-[8px] rounded-md cursor-pointer text-center ${
                        endTime === `${i}:00` ? "text-[#816DFF]" : ""
                      }`}
                    >
                      {i.toString().padStart(2, "0")}:00
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              className="bg-[#816DFF] text-white py-[8px] px-[16px] rounded-md disabled:bg-[#e0dcff]"
              disabled={!startTime.trim() || !endTime.trim()}
              onClick={() => handleChange(startTime, endTime)}
            >
              확인
            </button>
            <button
              className="text-[#816DFF] py-[8px] px-[16px] rounded-md"
              onClick={() => setIsOpen(false)}
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
