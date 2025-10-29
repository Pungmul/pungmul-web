"use client";

import Image from "next/image";
import checkMark from "@public/icons/checkMark.svg";
import {
  InstrumentAssignRequestDTO,
  InstrumentAssignRequestDTOList,
} from "@/features/lightning";
import { instrumentNamesMap } from "@/features/instrument-status";
import type { Instrument } from "@/features/instrument-status";
import { useEffect, useState } from "react";

interface InstrumentAssignFormProps {
  InstrumentAssignRequestData: InstrumentAssignRequestDTO<Instrument>;
  setInstrumentAssignRequestDTOList: React.Dispatch<
    React.SetStateAction<InstrumentAssignRequestDTOList>
  >;
}

const InstrumentAssignForm: React.FC<InstrumentAssignFormProps> = ({
  InstrumentAssignRequestData,
  setInstrumentAssignRequestDTOList,
}) => {
  const { instrument, minPersonNum, maxPersonNum } =
    InstrumentAssignRequestData;

  const [minPersonNumCache, setMinPersonNumCache] = useState(minPersonNum);
  const [maxPersonNumCache, setMaxPersonNumCache] = useState(maxPersonNum);
  const [isNotRecruit, setIsNotRecruit] = useState(false);

  const increaseMinPersonNum = () => {
    if (minPersonNumCache < maxPersonNumCache) {
      setMinPersonNumCache(minPersonNumCache + 1);
    }
  };
  const decreaseMinPersonNum = () => {
    if (minPersonNumCache > 0) {
      setMinPersonNumCache(minPersonNumCache - 1);
    }
  };
  const increaseMaxPersonNum = () => {
    if (maxPersonNumCache + 1 < 100) {
      setMaxPersonNumCache(maxPersonNumCache + 1);
    }
  };
  const decreaseMaxPersonNum = () => {
    if (maxPersonNumCache > minPersonNumCache) {
      setMaxPersonNumCache(maxPersonNumCache - 1);
    }
  };

  useEffect(() => {
    setInstrumentAssignRequestDTOList(
      (prev) =>
        prev.map((item) =>
          item.instrument === instrument ? InstrumentAssignRequestData : item
        ) as InstrumentAssignRequestDTOList
    );
  }, [minPersonNumCache, maxPersonNumCache, isNotRecruit, instrument, InstrumentAssignRequestData, setInstrumentAssignRequestDTOList]);

  return (
    <div
      key={instrument + "Personnel"}
      className="flex flex-col items-center gap-[8px] w-[96px] h-[160px]"
    >
      <div
        className="text-[14px] text-grey-400 w-full text-center"
      >
        {instrumentNamesMap[instrument]}
      </div>
      {isNotRecruit ? (
        <div
        className="text-[16px] leading-[16px] text-grey-400 h-[100px] w-full bg-grey-200 rounded-[8px] flex items-center justify-center"
        >
          모집 안함
        </div>
      ) : (
        <InstrumentAssignRange
          minPersonNum={minPersonNumCache}
          maxPersonNum={maxPersonNumCache}
          increaseMinPersonNum={increaseMinPersonNum}
          decreaseMinPersonNum={decreaseMinPersonNum}
          increaseMaxPersonNum={increaseMaxPersonNum}
          decreaseMaxPersonNum={decreaseMaxPersonNum}
        />
      )}
      <label
        htmlFor={instrument + "notRecruit"}
        className="flex w-full flex-row items-center cursor-pointer justify-center gap-[8px]"
      >
        <input
          type="checkbox"
          checked={isNotRecruit}
          onChange={(e) => {
            setIsNotRecruit(e.currentTarget.checked);
            if (e.currentTarget.checked) {
              setInstrumentAssignRequestDTOList(
                (prev) =>
                  prev.map((item) =>
                    item.instrument === instrument
                      ? {
                          ...item,
                          minPersonNum: 0,
                          maxPersonNum: 0,
                        }
                      : item
                  ) as InstrumentAssignRequestDTOList
              );
            } else {
              setInstrumentAssignRequestDTOList(
                (prev) =>
                  prev.map((item) =>
                    item.instrument === instrument
                      ? {
                          ...item,
                          minPersonNum: minPersonNumCache,
                          maxPersonNum: maxPersonNumCache,
                        }
                      : item
                  ) as InstrumentAssignRequestDTOList
              );
            }
          }}
          name={instrument + "notRecruit"}
          id={instrument + "notRecruit"}
          className="hidden peer"
        />
        <div
          className="hidden size-[16px] peer-checked:flex rounded-sm items-center justify-center bg-primary"
        >
          <Image src={checkMark} width={12} alt="" />
        </div>
        <div
          className="block size-[16px] border border-grey-400 peer-checked:hidden rounded-sm bg-background"
        />
        <div
          className="text-[14px] line-height-[16px] text-grey-400 peer-checked:text-grey-800 peer-checked:font-semibold"
        >
          모집 안함
        </div>
      </label>
    </div>
  );
};

export default InstrumentAssignForm;

interface InstrumentAssignRangeProps {
  minPersonNum: number;
  maxPersonNum: number;
  increaseMinPersonNum: () => void;
  decreaseMinPersonNum: () => void;
  increaseMaxPersonNum: () => void;
  decreaseMaxPersonNum: () => void;
}

const InstrumentAssignRange: React.FC<InstrumentAssignRangeProps> = ({
  minPersonNum,
  maxPersonNum,
  increaseMinPersonNum,
  decreaseMinPersonNum,
  increaseMaxPersonNum,
  decreaseMaxPersonNum,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-evenly h-[100px]"
    >
      <div
        className="flex flex-row items-center justify-center gap-[8px]"
      >
        <div
          className={"rounded-full border-gray-300 text-gray-500 cursor-pointer border size-[24px] items-center justify-center flex " + (minPersonNum > 0 ? "bg-grey-100" : "bg-grey-200")}
          onClick={() => {
            if (minPersonNum > 0) decreaseMinPersonNum();
          }}
        >
          {"-"}
        </div>
        <div>{minPersonNum}</div>
        <div
          className={"rounded-full border-gray-300 text-gray-500 cursor-pointer border size-[24px] items-center justify-center flex " + (maxPersonNum - 1 > minPersonNum ? "bg-grey-100" : "bg-grey-200")}
          onClick={() => {
            increaseMinPersonNum();
          }}
        >
          {"+"}
        </div>
      </div>
      <div
        className="flex flex-row items-center justify-center gap-[8px]"
      >
        <div
          className={"rounded-full border-gray-300 text-gray-500 cursor-pointer border size-[24px] items-center justify-center flex " + (maxPersonNum - 1 > minPersonNum ? "bg-grey-100" : "bg-grey-200")}
          onClick={() => {
            decreaseMaxPersonNum();
          }}
        >
          {"-"}
        </div>
        <div>{maxPersonNum}</div>
        <div
          className={"rounded-full border-gray-300 text-gray-500 cursor-pointer border size-[24px] items-center justify-center flex " + (maxPersonNum < 100 ? "bg-grey-100" : "bg-grey-200")}
          onClick={() => {
            increaseMaxPersonNum();
          }}
        >
          {"+"}
        </div>
      </div>
    </div>
  );
};
