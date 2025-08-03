"use client";

import React from "react";
import { Modal } from "@/shared/components";
import DaumPostcode, { Address } from "react-daum-postcode";

interface LightningAddressInputProps {
  address: string;
  setAddress: (value: string) => void;
  detailAddress: string;
  setDetailAddress: (value: string) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (value: boolean) => void;
  isDetailAddressModalOpen: boolean;
  setIsDetailAddressModalOpen: (value: boolean) => void;
}

export default function LightningAddressInput({
  address,
  setAddress,
  detailAddress,
  setDetailAddress,
  isAddressModalOpen,
  setIsAddressModalOpen,
  isDetailAddressModalOpen,
  setIsDetailAddressModalOpen,
}: LightningAddressInputProps) {
  const completeHandler = (data: Address) => {
    const { roadAddress } = data;
    setAddress(roadAddress);
    setIsAddressModalOpen(false);
    setIsDetailAddressModalOpen(true);
  };

  return (
    <>
      <div className="w-full flex flex-row justify-between px-[24px] items-center">
        <div style={{ fontSize: 14, color: "#9A9A9A" }}>주소</div>
        {address ? (
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row">
              {address}, {detailAddress}
            </div>
            <div
              className="cursor-pointer px-[8px] py-[4px] rounded-full border border-[#CDC5FF] text-[#CDC5FF] font-semibold text-[14px]"
              onClick={() => setIsAddressModalOpen(true)}
            >
              다시 선택
            </div>
          </div>
        ) : (
          <div
            className="cursor-pointer px-[8px] py-[4px] rounded-full border border-[#CDC5FF] text-[#CDC5FF] font-semibold text-[14px]"
            onClick={() => setIsAddressModalOpen(true)}
          >
            주소 선택
          </div>
        )}
      </div>
      <Modal
        isOpen={isAddressModalOpen}
        title="주소 선택"
        onClose={() => setIsAddressModalOpen(false)}
      >
        <div className="flex">
          <DaumPostcode
            style={{ width: "100%", height: "500px" }}
            onComplete={completeHandler}
          />
        </div>
      </Modal>
      <Modal
        isOpen={isDetailAddressModalOpen}
        title="상세 주소 입력"
        onClose={() => setIsDetailAddressModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center">
            <div className="text-center p-2 rounded-md font-light bg-gray-100 text-gray-400 text-[14px]">
              기본 주소
            </div>
            <div className="flex-grow">{address}</div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div className="text-center p-2 rounded-md font-light bg-gray-100 text-gray-400 text-[14px]">
              상세 주소
            </div>
            <div className="flex-grow">
              <input
                type="text"
                value={detailAddress ?? ""}
                placeholder="상세 주소를 입력해주세요."
                onChange={(e) => setDetailAddress(e.currentTarget.value)}
                className="flex w-full"
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: "#CDC5FF",
                  fontSize: 14,
                  outlineColor: "#816DFF",
                }}
              />
            </div>
          </div>
          <div
            className={
              "w-full text-center p-4 rounded-md text-white cursor-pointer " +
              (detailAddress && detailAddress.length > 0
                ? "bg-[#816DFF]"
                : "bg-[#CDC5FF]")
            }
            onClick={() => {
              if (detailAddress && detailAddress.length > 0) {
                setIsDetailAddressModalOpen(false);
              }
            }}
          >
            확인
          </div>
        </div>
      </Modal>
    </>
  );
}
