"use client";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@pThunder/shared";
import checkMark from "@public/icons/checkMark.svg";
import { usePromotionPostingStore } from "../../store/promotionPostingStore";
import LocationModal from "@pThunder/shared/components/ui/LocationModal";
import { DateInput, TimeInput } from "@pThunder/shared/components/form";

export const PromotionInfoForm = () => {
  // Zustand store에서 필요한 상태와 액션 가져오기
  const {
    title,
    address,
    limitPersonnel,
    isUnlimitedPersonnel,
    setTitle,
    setAddress,
    setDetailAddress,
    setLimitPersonnel,
    setIsUnlimitedPersonnel,
    getFormattedDate,
    getFormattedTime,
    setDate,
    setTime,
  } = usePromotionPostingStore();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col w-full max-w-[640px] min-w-[320px] mx-auto gap-[32px]">
      <Input
        label="제목"
        placeholder="제목을 입력해주세요."
        className="w-full"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="w-full flex flex-row justify-between items-center px-[4px]">
        <div className="text-[14px] text-grey-400">주소</div>
        {address ? (
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row">
              {address ? address.buildingName : ""}
            </div>
            <div
              className="cursor-pointer px-[8px] py-[4px] rounded-full bg-black text-white font-semibold text-[14px]"
              onClick={() => setIsAddressModalOpen(true)}
            >
              다시 선택
            </div>
          </div>
        ) : (
          <div
            className="cursor-pointer px-[8px] py-[4px] rounded-full bg-black text-white font-semibold text-[14px]"
            onClick={() => setIsAddressModalOpen(true)}
          >
            주소 선택
          </div>
        )}
      </div>
      <LocationModal
        isLocationModalOpen={isAddressModalOpen}
        initialAddress={address ? {latitude: address?.latitude || 0, longitude: address?.longitude || 0} : null}
        setIsLocationModalOpen={setIsAddressModalOpen}
        onSubmit={(location) => {
          setIsAddressModalOpen(false);
          setAddress({ ...location, detail: "", buildingName: location.buildingName || "" });
        }}
        withSearchBar={true}
      />
      <Input
        label="상세주소"
        placeholder="상세주소를 입력해주세요."
        className="w-full"
        type="text"
        value={address?.detail || ""}
        onChange={(e) => setDetailAddress(e.target.value)}
      />
      <div className="w-full flex flex-row items-start justify-start gap-[12px]">
        
        <DateInput
          label="날짜"
          placeholder="날짜를 입력해주세요."
          className="w-full"
          value={getFormattedDate()}
          onChange={(date) => setDate(date)}
        />
        <TimeInput
          label="공연 시간"
          placeholder="공연 시간을 입력해주세요."
          className="w-full"
          value={getFormattedTime()}
          showAmPm={true}
          onChange={(time) => setTime(time)}
        />
        {/* <Input
          label="날짜"
          placeholder="날짜를 입력해주세요."
          className="w-full"
          type="date"
          value={getFormattedDate()}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          label="공연 시간"
          placeholder="공연 시간을 입력해주세요."
          className="w-full"
          type="time"
          value={getFormattedTime()}
          onChange={(e) => setTime(e.target.value)}
        /> */}
      </div>
      <div className="w-full flex flex-col justify-between items-start gap-[8px]">
        <Input
          label="제한 인원"
          placeholder={
            isUnlimitedPersonnel ? "제한 없음" : "제한 인원을 입력해주세요."
          }
          className={
            "w-full disabled:text-grey-400 disabled:cursor-not-allowed"
          }
          type="number"
          disabled={isUnlimitedPersonnel}
          value={isUnlimitedPersonnel ? "" : limitPersonnel.toString()}
          onChange={(e) => setLimitPersonnel(parseInt(e.target.value))}
        />
        <label className="flex flex-row gap-2 items-center cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={isUnlimitedPersonnel}
            onChange={(e) => setIsUnlimitedPersonnel(e.currentTarget.checked)}
            name="isUnlimitedPersonnel"
            id="isUnlimitedPersonnel"
            className="hidden peer"
          />
          <div className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center peer-checked:bg-black">
            <Image src={checkMark} width={12} height={12} alt="" />
          </div>
          <div className="block w-5 h-5 bg-background border border-grey-300 peer-checked:hidden rounded-sm" />
          <div className="text-grey-400 peer-checked:text-grey-800 text-[12px]">
            제한 없음
          </div>
        </label>
      </div>
    </div>
  );
};
