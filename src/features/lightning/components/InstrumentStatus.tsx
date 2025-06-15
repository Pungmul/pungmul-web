'use client';
import {
  instrumentNamesMap,
  abilityNamesMap,
  instrumentAbilities,
} from "@/shared/types/instrument/constant";
import { Instrument, InstrumentStatus } from "@/shared/types/instrument/type";
import { useEffect, useRef, useState } from "react";

interface InstrumentStatusProps {
  instrumentStatus: InstrumentStatus;
  deleteHandler: (instrument: Instrument) => void;
  updateHandler: (newInstrumentStatus: InstrumentStatus) => void;
}

const InstrumentStatusBlock: React.FC<InstrumentStatusProps> = ({
  instrumentStatus,
  deleteHandler,
  updateHandler,
}) => {
  const { instrument, instrumentAbility, major } = instrumentStatus;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      key={instrument}
      className="flex flex-row justify-between items-center group"
    >
      <div className="flex items-center flex-row gap-[8px]">
        <div
          className={`w-[32px] h-[32px] px-[4px] pb-[4px] flex flex-row items-center justify-center cursor-pointer group-hover:opacity-100 ${
            major ? "" : `opacity-0`
          }`}
          onClick={() => {
            updateHandler({
              ...instrumentStatus,
              major: !major,
            });
          }}
        >
          {major ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#fcd34d"
              className="size-6 flex justify-center items-center w-full h-full"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fcd34d"
              className="size-6 flex justify-center items-center w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          )}
        </div>
        <div className="text-[18px]">{instrumentNamesMap[instrument]}</div>
      </div>
      <div className="flex h-full items-center flex-row gap-1">
        <div className="relative w-[96px] h-full">
          <div
            className="w-full h-full text-right cursor-pointer text-[18px]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {abilityNamesMap[instrumentAbility]}
          </div>
          {isOpen && (
            <div
              ref={menuRef}
              className="absolute top-0 right-0 w-full flex flex-col items-center justify-start bg-white z-10 border border-gray-300 rounded-md"
            >
              {instrumentAbilities.map((ability) => (
                <div
                  key={ability}
                  className="w-full h-full text-right hover:bg-gray-100 px-[8px] py-[8px] cursor-pointer text-[18px]"
                  onClick={() => {
                    updateHandler({
                      ...instrumentStatus,
                      instrumentAbility: ability,
                    });
                    setIsOpen(false);
                  }}
                >
                  {abilityNamesMap[ability]}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-center w-[24px] h-[16px] cursor-pointer opacity-0 group-hover:opacity-100"
          onClick={() => {
            deleteHandler(instrument);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#AAA"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default InstrumentStatusBlock;