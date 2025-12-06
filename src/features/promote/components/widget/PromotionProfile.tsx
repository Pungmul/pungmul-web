"use client";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Modal, Responsive } from "@pThunder/shared";
import type { Address } from "@/shared/types";
import dayjs from "dayjs";
import { useState, useImperativeHandle, useRef } from "react";
import Image from "next/image";

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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} hasHeader={false}>
      <div className="flex flex-col gap-[12px] px-[12px] py-[8px]">
        <a
          target="_blank"
          href={`https://map.naver.com/p?title=${address?.detail || address?.buildingName}&lng=${address?.longitude}&lat=${address?.latitude}&zoom=${NAVER_MAP_ZOOM_LEVEL}`}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="text-white text-[16px] text-center font-semibold bg-[#2db400] rounded-[8px] p-[8px]"
        >
          네이버 지도로 보기
        </a>
        <a
          target="_blank"
          href={`https://map.kakao.com/link/map/${address?.detail || address?.buildingName},${address?.latitude},${address?.longitude},${KAKAO_MAP_ZOOM_LEVEL}`}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="text-grey-800 text-[16px] text-center font-semibold bg-[#FEE500] rounded-[8px] p-[8px]"
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
                {address?.detail || address?.buildingName || "주소 없음"}
              </span>
              <ChevronRightIcon className="w-[16px] h-[16px] text-grey-500 flex-shrink-0" />
            </div>
            <div className="flex flex-row gap-[12px] items-center font-normal max-w-full line-clamp-1">
              <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
                날짜
              </span>
              <span className="font-normal text-grey-800 text-[14px] lg:text-[18px]">
                {(() => {
                  const date = startAt
                    ? dayjs(new Date(startAt))
                    : dayjs(new Date("2025-09-11T17:00:00"));
                  return `${date.format("YYYY.MM.DD(ddd)")}`;
                })()}
              </span>
            </div>
            <div className="flex flex-row gap-[12px] items-center font-normal max-w-full line-clamp-1">
              <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
                시간
              </span>

              <span className="font-normal text-grey-800 text-[14px] lg:text-[18px]">
                {(() => {
                  const date = startAt
                    ? dayjs(new Date(startAt))
                    : dayjs(new Date("2025-09-11T17:00:00"));
                  const hour = date.hour();
                  const timePrefix = hour < 12 ? "이른" : "늦은";
                  const time12 = date.format("h시 mm분");
                  return `${timePrefix} ${time12}`;
                })()}
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
              {/* <span className="font-normal text-grey-500 text-[14px] lg:text-[18px] ">
                장소
              </span> */}
              <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
                {address?.detail || address?.buildingName || "주소 없음"}
              </span>
              <ChevronRightIcon className="w-[12px] h-[12px] text-grey-500 flex-shrink-0" />
            </div>
            <div className="flex flex-row gap-[4px] items-center font-normal max-w-full line-clamp-1">
              {/* <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
                날짜
              </span> */}
              <span className="font-normal text-grey-500 text-[14px] lg:text-[18px]">
                {(() => {
                  const date = startAt
                    ? dayjs(new Date(startAt))
                    : dayjs(new Date("2025-09-11T17:00:00"));
                  return `${date.format("YYYY.MM.DD (ddd)")}`;
                })()}
              </span>
            </div>
          </div>
        </div>
        {/* <div className="w-full flex flex-col gap-[16px] bg-grey-100 px-[24px] py-[16px]">
          <PromotionAddress address={address || null} />
          <PromotionTime startAt={startAt || "2025-09-11T17:00:00"} />
        </div> */}
      </section>
    </>
  );
};

// const PromotionAddress = ({ address }: { address?: Address | null }) => {
//   const addressModalRef = useRef<{
//     handleClose: () => void;
//     handleOpen: () => void;
//   }>(null);
//   return (
//     <>
//       {address && <AddressModal address={address} ref={addressModalRef} />}
//       <section
//         className="w-full flex flex-col gap-[12px] bg-background px-[12px] py-[8px] rounded-[8px] cursor-pointer"
//         onClick={(e) => {
//           e.stopPropagation();
//           addressModalRef.current?.handleOpen();
//         }}
//       >
//         <h6 className="text-grey-400 text-[14px] font-semibold">공연 장소</h6>
//         <div className="flex flex-row items-center gap-[8px]">
//           <div className="text-grey-800 text-[16px] font-normal flex-grow max-w-full line-clamp-2">
//             {address?.detail || ""}
//           </div>
//           <ChevronRightIcon className="w-[16px] h-[16px] text-grey-500" />
//         </div>
//       </section>
//     </>
//   );
// };

// const PromotionTime = ({ startAt }: { startAt?: string }) => {
//   return (
//     <section className="w-full flex flex-col gap-[12px] bg-white px-[12px] py-[8px] rounded-[8px] cursor-pointer">
//       <h6 className="text-grey-400 text-[14px] font-semibold">공연 시간</h6>
//       <div className="flex flex-row items-center gap-[8px]">
//         <div className="text-grey-800 text-[16px] font-normal flex-grow max-w-full line-clamp-2">
//           {(() => {
//             const date = startAt
//               ? dayjs(new Date(startAt))
//               : dayjs(new Date("2025-09-11T17:00:00"));
//             const hour = date.hour();
//             const timePrefix = hour < 12 ? "이른" : "늦은";
//             const time12 = date.format("h시 mm분");
//             return `${date.format("YYYY.MM.DD(ddd)")} ${timePrefix} ${time12}`;
//           })()}
//         </div>
//       </div>
//     </section>
//   );
// };
