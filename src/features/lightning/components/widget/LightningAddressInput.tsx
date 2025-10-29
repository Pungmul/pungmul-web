"use client";

import React, { useState, useMemo, useCallback } from "react";
import type { Address } from "@/shared";
import { ChipButton } from "@/shared/components";
import { LocationModal } from "@/shared";
import type { LocationType } from "@/features/location";

import { useController } from "react-hook-form";

function LightningAddressInput() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const {
    field: { value: address, onChange: setAddress },
  } = useController({ name: "address" });

  const {
    field: { value: locationPoint, onChange: setLocationPoint },
  } = useController({ name: "locationPoint" });

  const completeHandler = useCallback(
    (data: Omit<Address, "detail">) => {
      const { buildingName, latitude, longitude } = data;
      setAddress(buildingName ?? "");
      setLocationPoint({ latitude, longitude, detail: "" });
      setIsAddressModalOpen(false);
    },
    [setAddress, setLocationPoint]
  );

  // initialAddress 메모이제이션 - 불필요한 리렌더링 방지
  const initialAddress = useMemo((): LocationType | null => {
    if (!address || !locationPoint?.latitude || !locationPoint?.longitude) {
      return null;
    }
    return {
      latitude: locationPoint.latitude,
      longitude: locationPoint.longitude,
    };
  }, [address, locationPoint?.latitude, locationPoint?.longitude]);

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center">
        <div className="text-grey-400 text-[14px]">주소</div>
        {address ? (
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row">{address}</div>
            <ChipButton
              filled={true}
              onClick={() => setIsAddressModalOpen(true)}
            >
              다시 선택
            </ChipButton>
          </div>
        ) : (
          <ChipButton
            filled={false}
            onClick={() => setIsAddressModalOpen(true)}
          >
            주소 선택
          </ChipButton>
        )}
      </div>

      <LocationModal
        initialAddress={initialAddress}
        isLocationModalOpen={isAddressModalOpen}
        setIsLocationModalOpen={setIsAddressModalOpen}
        onSubmit={completeHandler}
      />
    </>
  );
}

export default React.memo(LightningAddressInput);
