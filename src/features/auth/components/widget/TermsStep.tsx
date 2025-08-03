"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import checkMark from "@public/icons/checkMark.svg";

interface TermsStepProps {
  usingTermAgree: boolean;
  setUsingTermAgree: (value: boolean) => void;
  personalInfoAgree: boolean;
  setPersonalInfoAgree: (value: boolean) => void;
}

export const TermsStep: React.FC<TermsStepProps> = ({
  usingTermAgree,
  setUsingTermAgree,
  personalInfoAgree,
  setPersonalInfoAgree,
}) => {
  const [allAgree, setAllAgree] = useState(false);

  useEffect(() => {
    if (usingTermAgree && personalInfoAgree) {
      setAllAgree(true);
    } else {
      setAllAgree(false);
    }
  }, [usingTermAgree, personalInfoAgree]);

  useEffect(() => {
    if (allAgree) {
      if (!usingTermAgree || !personalInfoAgree) {
        setUsingTermAgree(true);
        setPersonalInfoAgree(true);
      }
    } else if (usingTermAgree && personalInfoAgree) {
      setUsingTermAgree(false);
      setPersonalInfoAgree(false);
    }
  }, [allAgree, setUsingTermAgree, setPersonalInfoAgree, usingTermAgree, personalInfoAgree]);

  return (
    <div className="flex flex-col flex-grow">
      <div style={{ padding: "0 24px", width: "100%" }}>
        <label
          htmlFor="all_check"
          className="flex w-full flex-row items-center cursor-pointer px-[12px] py-[16px] bg-[#E7E7E7] rounded-[6px] gap-[8px]"
        >
          <input
            type="checkbox"
            checked={allAgree}
            onChange={(e) => {
              const checked = e.target.checked;
              setAllAgree(checked);
            }}
            name="all_check"
            id="all_check"
            className="hidden peer"
          />
          <div className="hidden w-[16px] h-[16px] peer-checked:flex rounded-sm items-center justify-center bg-[#816DFF]">
            <Image src={checkMark} height={12} width={12} alt="" />
          </div>
          <div
            className="block w-5 h-5 border border-[#979797] peer-checked:hidden rounded-sm"
            style={{ backgroundColor: "#FFF", width: 16, height: 16 }}
          />
          <div
            style={{ fontSize: 14, lineHeight: "16px" }}
            className="text-[#818181] peer-checked:text-black peer-checked:font-semibold"
          >
            모든 약관에 동의
          </div>
        </label>
      </div>
      <div
        className="flex flex-col"
        style={{ padding: "0 24px", width: "100%", gap: 28, marginTop: 28 }}
      >
        <div
          className="flex flex-row justify-between items-center"
          style={{ padding: "0 12px" }}
        >
          <label
            htmlFor="약관"
            className="flex w-full flex-row items-center cursor-pointer"
            style={{ borderRadius: 5, gap: 8 }}
          >
            <input
              type="checkbox"
              checked={usingTermAgree}
              onChange={(e) => {
                const checked = e.target.checked;
                setUsingTermAgree(checked);
              }}
              name="약관"
              id="약관"
              className="hidden peer"
            />
            <div className="hidden w-[16px] h-[16px] peer-checked:flex rounded-sm items-center justify-center bg-[#816DFF]">
              <Image src={checkMark} height={12} width={12} alt="" />
            </div>
            <div
              className="block w-5 h-5 border border-[#979797] peer-checked:hidden rounded-sm"
              style={{ backgroundColor: "#FFF", width: 16, height: 16 }}
            />
            <div
              className="flex flex-row items-center text-[#818181] peer-checked:text-black peer-checked:font-semibold"
              style={{ gap: 4 }}
            >
              <div style={{ fontSize: 14, lineHeight: "16px" }} className="">
                약관동의
              </div>
              <div
                style={{ fontSize: 14, lineHeight: "16px", fontWeight: 500 }}
                className="text-[#FF0000]"
              >
                (필수)
              </div>
            </div>
          </label>

          <ChevronRightIcon className="w-[16px] h-[16px] cursor-pointer" />

        </div>

        <div
          className="flex flex-row justify-between items-center"
          style={{ padding: "0 12px" }}
        >
          <label
            htmlFor="개인정보"
            className="flex w-full flex-row items-center cursor-pointer"
            style={{ borderRadius: 5, gap: 8 }}
          >
            <input
              type="checkbox"
              checked={personalInfoAgree}
              onChange={(e) => {
                const checked = e.target.checked;
                setPersonalInfoAgree(checked);
              }}
              name="개인정보"
              id="개인정보"
              className="hidden peer"
            />
            <div
              className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
              style={{ backgroundColor: "#816DFF", width: 16, height: 16 }}
            >
              <Image src={checkMark} width={12} alt="" />
            </div>
            <div
              className="block w-5 h-5 border border-[#979797] peer-checked:hidden rounded-sm"
              style={{ backgroundColor: "#FFF", width: 16, height: 16 }}
            />
            <div
              className="flex flex-row items-center text-[#818181] peer-checked:text-black peer-checked:font-semibold"
              style={{ gap: 4 }}
            >
              <div style={{ fontSize: 14, lineHeight: "16px" }} className="">
                개인정보 이용동의
              </div>
              <div
                style={{ fontSize: 14, lineHeight: "16px", fontWeight: 500 }}
                className="text-[#FF0000]"
              >
                (필수)
              </div>
            </div>
          </label>
          <ChevronRightIcon className="w-[16px] h-[16px] cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
