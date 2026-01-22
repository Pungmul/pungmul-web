"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";

import { BottomFixedButton, Header, Spinner } from "@/shared/components";
import MapContainer from "@/shared/components/MapContainer";
import { useKakaoMapsEffect } from "@/shared/hooks/useKakaoMaps";
import { Toast } from "@/shared";

import {
  createLightningErrorToastConfig,
  createLightningSuccessToastConfig,
} from "../../constant";
import { createLightningCircle } from "../../lib";
import { useCreateLightning } from "../../queries";
import { useLightningCreateStore } from "../../store/lightningCreateStore";

export default function LightningCreateCheckForm() {
  const router = useRouter();
  const { formData } = useLightningCreateStore();
  const { mutate, isPending } = useCreateLightning();

  const handleCreate = () => {
    mutate(formData, {
      onSuccess: () => {
        Toast.show(createLightningSuccessToastConfig);
        router.replace("/lightning");
      },
      onError: (error) => Toast.show(createLightningErrorToastConfig(error)),
    });
  };

  const mapRef = useRef<kakao.maps.Map>(null);

  useKakaoMapsEffect(() => {
    if (!mapRef.current || !formData.locationPoint) return;

    const { marker, circle } = createLightningCircle({
      locationPoint: formData.locationPoint,
    });

    marker.setMap(mapRef.current);
    circle.setMap(mapRef.current);
    mapRef.current.setCenter(
      new kakao.maps.LatLng(
        formData.locationPoint.latitude,
        formData.locationPoint.longitude
      )
    );
    // 지도 중심 이동
  }, [formData.locationPoint]);

  return (
    <div className="flex flex-col h-full">
      <Header title="번개 확인" />

      <div className="flex-1 px-4 py-6">
        {/* 지도 */}
        <div className="w-full aspect-[20/9] rounded-lg overflow-hidden">
          <MapContainer
            mapRef={mapRef}
            className="w-full h-full"
            additionalOptions={{ draggable: false, scrollwheel: false }}
          />
        </div>
        {/* 기본 정보 */}
        <div className="bg-background rounded-lg p-4">
          <div className="gap-2 flex flex-col">
            <div>
              <span className="text-sm text-grey-500">위치:</span>
              {formData.detailAddress ? (
                <span className="inline-flex flex-col gap-1 ml-2">
                  <div className="font-medium">{formData.detailAddress}</div>
                  <div className="text-sm text-grey-500">
                    {formData.address}
                  </div>
                </span>
              ) : (
                <span className="ml-2 font-medium">{formData.address}</span>
              )}
            </div>
            <div>
              <span className="text-sm text-grey-500">모임 이름:</span>
              <span className="ml-2 font-medium">{formData.title}</span>
            </div>
            <div>
              <span className="text-sm text-grey-500">유형:</span>
              <span className="ml-2 font-medium">{formData.lightningType}</span>
            </div>
            <div>
              <span className="text-sm text-grey-500">인원:</span>
              <span className="ml-2 font-medium">
                {formData.minPersonnel}~{formData.maxPersonnel}명
              </span>
            </div>
            <div>
              <span className="text-sm text-grey-500">시간:</span>
              <span className="ml-2 font-medium">
                {formData.startTime} ~ {formData.endTime}
              </span>
            </div>
            <div>
              <span className="text-sm text-grey-500">모집 마감:</span>
              <span className="ml-2 font-medium">
                {formData.recruitEndTime}
              </span>
            </div>

            <div>
              <span className="text-sm text-grey-500">공개 범위:</span>
              <span className="ml-2 font-medium">{formData.target}</span>
            </div>
          </div>

          {/* 위치 정보 */}
        </div>

        {/* 시간 및 태그 */}
        {formData.tagList && formData.tagList.length > 0 && (
          <div className="bg-background rounded-lg p-4 border-b border-b-grey-100">
            <div>
              <span className="text-sm text-grey-500">태그:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.tagList.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-grey-700 text-background text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <BottomFixedButton
        type="button"
        onClick={handleCreate}
        disabled={isPending}
      >
        {isPending ? <Spinner /> : "번개 생성"}
      </BottomFixedButton>
    </div>
  );
}
