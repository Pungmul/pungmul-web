"use client";

import { useCallback,useMemo } from "react";

import { LocationMapPicker } from "@/shared/components/ui";

import type { LocationType } from "@/features/location";

import { useLightningCreateStore } from "../../../store/lightningCreateStore";

export const SelectLocationStep = () => {
  const formData = useLightningCreateStore((state) => state.formData);
  const updateField = useLightningCreateStore((state) => state.updateField);
  
  const initialLocation = useMemo((): LocationType | null => {
    if (!formData.locationPoint?.latitude || !formData.locationPoint?.longitude) {
      return null;
    }
    return {
      latitude: formData.locationPoint.latitude,
      longitude: formData.locationPoint.longitude,
    };
  }, [formData.locationPoint]);

  const handleLocationChange = useCallback(
    (location: LocationType, address: string) => {
      updateField("address", address);
      updateField("locationPoint", location);
    },
    [updateField]
  );

  return (
    <div className="space-y-4 relative z-10">
      <LocationMapPicker
        initialLocation={initialLocation}
        onLocationChange={handleLocationChange}
        showSearchBar={true}
      />

      {/* 상세 주소 입력 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-grey-700">상세 주소</label>
        <input
          type="text"
          className="w-full p-3 rounded-lg bg-grey-100 border border-grey-200 focus:border-primary outline-none"
          placeholder="상세 주소를 입력하세요 (예: 101동 202호)"
          value={formData.detailAddress || ""}
          onChange={(e) => updateField("detailAddress", e.target.value)}
        />
      </div>
    </div>
  );
};
