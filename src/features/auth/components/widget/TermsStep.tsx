"use client";

import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import checkMark from "@public/icons/checkMark.svg";
import useTermStep from "../../hooks/useTermStep";
import Link from "next/link";

interface TermsStepFormData {
  usingTermAgree: boolean;
  personalInfoAgree: boolean;
}

interface TermsStepProps {
  onSubmit: (data: TermsStepFormData) => void;
}

export const TermsStep: React.FC<TermsStepProps> = ({ onSubmit }) => {
  const {
    form,
    handleTermAgree,
    handlePersonalInfoAgree,
    handleAllAgree,
    allAgree,
    usingTermAgree,
    personalInfoAgree,
    isProgressable,
  } = useTermStep();

  return (
    <form
      className="flex flex-col flex-grow"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form.getValues());
      }}
    >
      <div style={{ padding: "0 24px", width: "100%" }}>
        <label
          htmlFor="all_check"
          className="flex w-full flex-row items-center cursor-pointer px-[12px] py-[16px] bg-[#E7E7E7] rounded-[6px] gap-[8px]"
        >
          <input
            type="checkbox"
            checked={allAgree}
            onChange={handleAllAgree}
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
              onChange={handleTermAgree}
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
          <Link href="/terms" target="_blank">
            <ChevronRightIcon className="w-[16px] h-[16px] cursor-pointer" />
          </Link>
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
              onChange={handlePersonalInfoAgree}
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
          <Link href="/privacy" target="_blank">
            <ChevronRightIcon className="w-[16px] h-[16px] cursor-pointer" />
          </Link>
        </div>
      </div>
      <div className="w-full py-4" style={{ padding: "12px 36px" }}>
        <button
          type="submit"
          disabled={!isProgressable}
          className="w-full flex items-center justify-center text-white rounded"
          style={{
            height: 48,
            backgroundColor: isProgressable ? "#816DFF" : "#e2deff",
            cursor: isProgressable ? "pointer" : "not-allowed",
          }}
        >
          {isProgressable ? "다음" : "약관에 동의해주세요"}
        </button>
      </div>
    </form>
  );
};
