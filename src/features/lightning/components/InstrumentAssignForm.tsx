"use client";

import Image from "next/image";
import checkMark from "@public/icons/checkMark.svg";
import {
  InstrumentAssignRequestDTO,
  InstrumentAssignRequestDTOList,
} from "@/shared/types/lightning/type";
import { instrumentNamesMap } from "@/shared/types/instrument/constant";
import { Instrument } from "@/shared/types/instrument/type";
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
      className="flex flex-col items-center"
      style={{
        gap: 8,
        width: 96,
        height: 160,
      }}
    >
      <div
        style={{
          fontSize: 14,
          color: "#9A9A9A",
          width: "100%",
          textAlign: "center",
        }}
      >
        {instrumentNamesMap[instrument]}
      </div>
      {isNotRecruit ? (
        <div
          style={{
            fontSize: 16,
            lineHeight: "16px",
            color: "#9A9A9A",
            height: 100,
            width: "100%",
            backgroundColor: "#F5F5F5",
            borderRadius: 8,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
        className="flex w-full flex-row items-center cursor-pointer justify-center"
        style={{ gap: 8 }}
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
          className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
          style={{
            backgroundColor: "#816DFF",
            width: 16,
            height: 16,
          }}
        >
          <Image src={checkMark} width={12} alt="" />
        </div>
        <div
          className="block w-5 h-5 border border-[#979797] peer-checked:hidden rounded-sm"
          style={{
            backgroundColor: "#FFF",
            width: 16,
            height: 16,
          }}
        />
        <div
          style={{ fontSize: 14, lineHeight: "16px", color: "#9A9A9A" }}
          className="text-[#818181] peer-checked:text-black peer-checked:font-semibold"
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
      style={{
        height: 100,
        flexDirection: "column",
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <div
        className="flex flex-row items-center justify-center"
        style={{ gap: 8 }}
      >
        <div
          className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
          style={{
            backgroundColor: minPersonNum > 0 ? "#FFF" : "#DDD",
          }}
          onClick={() => {
            if (minPersonNum > 0) decreaseMinPersonNum();
          }}
        >
          {"-"}
        </div>
        <div>{minPersonNum}</div>
        <div
          className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
          style={{
            backgroundColor: maxPersonNum - 1 > minPersonNum ? "#FFF" : "#DDD",
          }}
          onClick={() => {
            increaseMinPersonNum();
          }}
        >
          {"+"}
        </div>
      </div>
      <div
        className="flex flex-row items-center justify-center"
        style={{ gap: 8 }}
      >
        <div
          className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
          style={{
            backgroundColor: maxPersonNum - 1 > minPersonNum ? "#FFF" : "#DDD",
          }}
          onClick={() => {
            decreaseMaxPersonNum();
          }}
        >
          {"-"}
        </div>
        <div>{maxPersonNum}</div>
        <div
          className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
          style={{
            backgroundColor: maxPersonNum < 100 ? "#FFF" : "#DDD",
          }}
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
