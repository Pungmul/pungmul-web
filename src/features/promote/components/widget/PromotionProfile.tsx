"use client";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Modal, Responsive } from "@pThunder/shared";
import type { Address } from "@/shared/types";
import { useState, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import {
  getAddressDisplayText,
  getAddressMapTitle,
  formatPromotionDate,
  formatPromotionTime,
} from "../../lib";

/** 카카오 맵 줌 레벨  1 ~ 8 클 수록 축소*/
const KAKAO_MAP_ZOOM_LEVEL = 1;

/** 네이버 맵 줌 레벨  4 ~ 20 클 수록 확대*/
const NAVER_MAP_ZOOM_LEVEL = 18;

interface PromotionProfileProps {
  posterUrl?: string;
  title?: string;
  address?: Address | null;
  startAt?: string;
}

export const PromotionProfile = (profileProps: PromotionProfileProps) => {
  return (
    <Responsive
      mobile={<PromotionProfileWidget {...profileProps} />}
      desktop={<PromotionProfileCard {...profileProps} />}
    />
  );
};

const AddressModal = ({
  address,
  ref,
}: {
  address?: Address;
  ref: React.RefObject<{
    handleClose: () => void;
    handleOpen: () => void;
  } | null>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  useImperativeHandle(ref, () => ({
    handleClose,
    handleOpen,
  }));

  const mapTitle = getAddressMapTitle(address);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} hasHeader={false}>
      <div className="flex flex-col gap-[12px] px-[12px] py-[8px]">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://map.naver.com/p?title=${encodeURIComponent(
            mapTitle
          )}&lng=${address?.longitude}&lat=${address?.latitude}&zoom=${NAVER_MAP_ZOOM_LEVEL}`}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="text-white text-[16px] text-center font-semibold bg-[#2db400] rounded-[8px] p-[8px]"
          aria-label="네이버 지도에서 위치 보기"
        >
          네이버 지도로 보기
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://map.kakao.com/link/map/${mapTitle},${address?.latitude},${address?.longitude},${KAKAO_MAP_ZOOM_LEVEL}`}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="text-grey-800 text-[16px] text-center font-semibold bg-[#FEE500] rounded-[8px] p-[8px]"
          aria-label="카카오 지도에서 위치 보기"
        >
          카카오 지도로 보기
        </a>
      </div>
    </Modal>
  );
};

const PromotionProfileCard = ({
  posterUrl,
  title,
  address,
  startAt,
}: PromotionProfileProps) => {
  const addressModalRef = useRef<{
    handleClose: () => void;
    handleOpen: () => void;
  }>(null);

  return (
    <>
      {address && <AddressModal address={address} ref={addressModalRef} />}
      <div className="w-full flex flex-row gap-[12px] lg:gap-[24px]  bg-background px-[24px] py-[16px]">
        <div className="relative h-[168px] lg:h-[330px]">
          <div className="relative h-full aspect-[2/3] flex items-center justify-center bg-grey-200 rounded-[4px] overflow-hidden border border-grey-200 ">
            {posterUrl && (
              <Image
                src={posterUrl || ""}
                alt={title || ""}
                fill
                className="object-cover object-center h-full "
              />
            )}
          </div>
        </div>
        <div className="flex-grow w-full flex flex-col items-start justify-end py-[12px] gap-[12px]">
          <div className="line-clamp-2 font-semibold text-[16px] lg:text-[23px] leading-[24px] text-grey-800">
            {title}
          </div>
          <div className="w-full border-t border-grey-200" />
          <div className="w-full flex flex-col gap-[4px] items-start">
            <div
              className="flex flex-row gap-[12px] items-center font-normal max-w-full line-clamp-1 w-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                addressModalRef.current?.handleOpen();
              }}
            >
              <span className="font-normal text-grey-500 text-[14px] lg:text-[18px] ">
                장소
              </span>
              <span className="font-normal text-grey-800 text-[14px] lg:text-[18px]">
                {getAddressDisplayText(address)}
              </span>
              <ChevronRightIcon className="w-[16px] h-[16px] text-grey-500 flex-shrink-0" />
            </div>
            <div className="flex flex-row gap-[12px] items-center font-normal max-w-full line-clamp-1">
              <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
                날짜
              </span>
              <span className="font-normal text-grey-800 text-[14px] lg:text-[18px]">
                {formatPromotionDate(startAt)}
              </span>
            </div>
            <div className="flex flex-row gap-[12px] items-center font-normal max-w-full line-clamp-1">
              <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
                시간
              </span>
              <span className="font-normal text-grey-800 text-[14px] lg:text-[18px]">
                {formatPromotionTime(startAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PromotionProfileWidget = ({
  posterUrl,
  title,
  address,
  startAt,
}: PromotionProfileProps) => {
  const addressModalRef = useRef<{
    handleClose: () => void;
    handleOpen: () => void;
  }>(null);
  return (
    <>
      {address && <AddressModal address={address} ref={addressModalRef} />}
      <section className="w-full flex flex-col gap-[12px]">
        <div className="w-full flex flex-col gap-[24px] bg-background px-[28px] py-[16px]">
          <div className="relative w-full px-[16px]">
            <div className="relative w-full aspect-[240/340] flex items-center justify-center bg-grey-200 rounded-[4px] overflow-hidden border border-grey-200 ">
              {posterUrl && (
                <Image
                  src={posterUrl || ""}
                  alt={title || ""}
                  fill
                  className="object-cover object-center h-full "
                />
              )}
            </div>
          </div>
          <div className="w-full flex justify-between flex-col items-start gap-[8px]">
            <div className="line-clamp-2 font-semibold text-[20px] leading-[24px] text-grey-800">
              {title || ""}
            </div>
          </div>
          <div className="w-full flex flex-col gap-[8px] ">
            <div
              className="flex flex-row gap-[4px] items-center font-normal max-w-full line-clamp-1 w-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                addressModalRef.current?.handleOpen();
              }}
            >
              <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
                {getAddressDisplayText(address)}
              </span>
              <ChevronRightIcon className="w-[12px] h-[12px] text-grey-500 flex-shrink-0" />
            </div>
            <div className="flex flex-row gap-[4px] items-center font-normal max-w-full line-clamp-1">
              <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
                {formatPromotionDate(startAt)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
