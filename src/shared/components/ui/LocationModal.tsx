"use client";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";

import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { debounce } from "lodash";

import type { LocationType } from "@/features/location";

import { locationStore } from "@/features/location";

import { default as Modal } from "./Modal";
import { Spinner } from "./Spinner";
import { Button } from "../buttons";

import type { Address } from "../../types";
import { useKakaoMaps } from "../../hooks";

interface LocationModalProps {
  isLocationModalOpen: boolean;
  initialAddress?: LocationType | null;
  setIsLocationModalOpen: (isLocationModalOpen: boolean) => void;
  onSubmit: (location: Omit<Address, "detail">) => void;
  withSearchBar?: boolean;
}

export default function LocationModal({
  isLocationModalOpen,
  initialAddress,
  setIsLocationModalOpen,
  onSubmit,
  withSearchBar = false,
}: LocationModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map>(null);
  const markerRef = useRef<kakao.maps.Marker>(null);
  const getCurrentPosition = locationStore().getCurrentPosition();
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(
    initialAddress ?? null
  );
  const [currentAddress, setCurrentAddress] = useState<string>("");

  // 카카오 지도 SDK 훅 사용
  const { kakaoMapsLoaded, error, isInitializing } = useKakaoMaps();

  // 지도 초기화 (SDK 로드 완료 후)
  useEffect(() => {
    if (!kakaoMapsLoaded || !isLocationModalOpen) return;

    const initializeMap = async () => {
      try {
        const currentLocation = initialAddress ?? (await getCurrentPosition);

        if (!currentLocation) {
          throw new Error("위치를 가져올 수 없습니다.");
        }

        const container = mapContainerRef.current;
        if (!container) {
          throw new Error("지도 컨테이너를 찾을 수 없습니다.");
        }

        const center = new window.kakao.maps.LatLng(
          currentLocation.latitude,
          currentLocation.longitude
        );
        const options = {
          center: center,
          level: 3,
        };

        const mapInstance = new window.kakao.maps.Map(container, options);

        // 주소-좌표 변환 객체를 생성합니다
        const geocoder = new window.kakao.maps.services.Geocoder();

        // 지도 중심에 고정된 마커 생성 (드래그 불가능)
        const markerPosition = center;

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: mapInstance,
        });

        markerRef.current = marker;
        setCurrentLocation({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });

        // 주소 검색 함수
        const searchAddrFromCoords = (
          coords: kakao.maps.LatLng,
          callback: (
            result: Array<{
              /**
               * 지번 주소 상세 정보
               */
              address: kakao.maps.services.Address;
              /**
               * 도로명 주소 상세 정보
               */
              road_address: kakao.maps.services.RoadAaddress | null;
            }>,
            status: kakao.maps.services.Status
          ) => void
        ) => {
          geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        };

        // 주소 정보 표시 함수
        const displayAddrInfo = (
          result: Array<{
            address: kakao.maps.services.Address;
            road_address: kakao.maps.services.RoadAaddress | null;
          }>,
          status: kakao.maps.services.Status
        ) => {
          if (status === window.kakao.maps.services.Status.OK) {
            let detailAddr = "";

            if (result[0]?.road_address) {
              detailAddr = result[0]?.road_address.address_name;
            } else if (result[0]?.address) {
              detailAddr = result[0].address.address_name;
            }

            setCurrentAddress(detailAddr);
          }
        };

        // 초기 주소 검색
        searchAddrFromCoords(markerPosition, displayAddrInfo);

        // 지도 이동이 완료되었을 때 마커를 항상 중심에 고정
        window.kakao.maps.event.addListener(
          mapInstance,
          "dragend",
          function () {
            // 지도 중심좌표를 얻어옵니다
            const latlng = mapInstance.getCenter();

            const newLocation = {
              latitude: latlng.getLat(),
              longitude: latlng.getLng(),
            };

            // 마커를 항상 지도 중심에 고정
            marker.setPosition(latlng);
            setCurrentLocation(newLocation);

            // 새로운 위치의 주소 검색
            searchAddrFromCoords(latlng, displayAddrInfo);
          }
        );

        // 지도 이동 중에도 마커가 중심에 고정되도록
        window.kakao.maps.event.addListener(
          mapInstance,
          "center_changed",
          function () {
            const latlng = mapInstance.getCenter();
            marker.setPosition(latlng);
          }
        );

        mapRef.current = mapInstance;
      } catch (error) {
        console.error("지도 초기화 에러:", error);
      }
    };

    initializeMap();
  }, [kakaoMapsLoaded, isLocationModalOpen]);

  const closeModal = useCallback(() => {
    setIsLocationModalOpen(false);
  }, [setIsLocationModalOpen]);

  const handleSubmit = useCallback(() => {
    if (currentLocation) {
      onSubmit({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        buildingName: currentAddress,
      });
      closeModal();
    }
  }, [onSubmit, currentLocation, currentAddress, closeModal]);

  const handleSelect = (result: kakao.maps.services.PlacesSearchResultItem) => {
    setCurrentAddress(result.place_name);
    setCurrentLocation({
      latitude: Number(result.y),
      longitude: Number(result.x),
    });
    mapRef.current?.panTo(
      new window.kakao.maps.LatLng(Number(result.y), Number(result.x))
    );
    markerRef.current?.setPosition(
      new window.kakao.maps.LatLng(Number(result.y), Number(result.x))
    );
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div>{error}</div>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  return (
    <Modal
      isOpen={isLocationModalOpen}
      title="주소 선택"
      onClose={closeModal}
      className="min-w-[200px] w-full max-w-[calc(100dvw-48px)]"
    >
      <div className="space-y-4">
        {withSearchBar && <LocationSearchBar onSelect={handleSelect} />}
        <div
          ref={mapContainerRef}
          className="w-full h-[300px] md:h-[500px] rounded-md overflow-hidden"
        />

        {currentAddress && (
          <div className="text-sm text-grey-600 bg-grey-100 p-3 rounded">
            <p className="font-medium">선택된 주소:</p>
            <p className="font-semibold text-grey-800">{currentAddress}</p>
            <p className="text-xs text-grey-500 mt-1">
              지도를 드래그하여 원하는 위치를 선택하세요
            </p>
          </div>
        )}
        <div className="flex space-x-2">
          <Button onClick={handleSubmit} className="bg-primary text-background">
            확인
          </Button>
          <Button
            type="button"
            onClick={closeModal}
            className="!bg-background border border-grey-500 text-grey-500"
          >
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}

const LocationSearchBar = ({
  onSelect,
}: {
  onSelect: (result: kakao.maps.services.PlacesSearchResultItem) => void;
}) => {
  const { searchResults, status, searchPlaces, searchValue, setSearchValue } =
    useLocationSearch();

  return (
    <div className="relative w-full flex flex-col gap-[8px] z-20">
      <div className="flex flex-row gap-[8px] py-[4px] bg-background ">
        <div className="flex flex-row gap-[8px] p-[8px] rounded-md bg-grey-100 border border-grey-100 focus-within:border-grey-400 w-full">
          <MagnifyingGlassIcon className="size-[24px] text-grey-400" />
          <input
            onSubmit={() => searchPlaces()}
            type="text"
            className="flex-grow bg-transparent outline-none peer font-light"
            placeholder="주소 검색"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          {searchValue.trim() !== "" && (
            <XCircleIcon
              className="w-[24px] h-[24px] cursor-pointer peer text-grey-400"
              width={24}
              height={24}
              onClick={() => {
                setSearchValue("");
              }}
            />
          )}
        </div>
      </div>
      {searchValue.trim() !== "" &&
        searchResults.length > 0 &&
        (status === kakao.maps.services.Status.OK ? (
          <div className="absolute bg-background top-full left-0 w-full z-10 flex flex-col gap-[8px] overflow-y-auto max-h-[200px]">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="flex flex-col gap-[4px] px-[8px] py-[4px] cursor-pointer hover:bg-grey-100"
                onClick={() => {
                  onSelect(result);
                }}
              >
                <div className="text-sm text-grey-600">{result.place_name}</div>
                <div className="text-xs text-grey-600">
                  {result.road_address_name || result.address_name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute bg-background top-full left-0 w-full z-10 flex flex-col gap-[8px] overflow-y-auto max-h-[200px]">
            <div className="text-sm text-grey-600">
              검색에 실패했습니다. 인터넷 연결을 확인해주세요.
            </div>
          </div>
        ))}
    </div>
  );
};

export const useLocationSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<
    kakao.maps.services.PlacesSearchResultItem[]
  >([]);
  const userLocation = locationStore().currentLocation;
  const [status, setStatus] = useState<kakao.maps.services.Status>();
  const ps = useRef(new kakao.maps.services.Places());

  const searchPlaces = useCallback(() => {
    const keyword = searchValue.trim();
    if (!keyword) return;

    ps.current.keywordSearch(
      keyword,
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          setSearchResults(data);
          setStatus(status);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          setSearchResults([]);
          setStatus(status);
        } else {
          setStatus(status);
        }
      },
      {
        location: userLocation
          ? new kakao.maps.LatLng(userLocation.latitude, userLocation.longitude)
          : new kakao.maps.LatLng(37.554678, 126.970606),
      }
    );
  }, [searchValue]);

  // ✅ debounce는 useMemo로 한번만 생성해야 한다
  const debouncedSearch = useMemo(
    () => debounce(searchPlaces, 500),
    [searchPlaces]
  );

  // ✅ 컴포넌트가 언마운트되면 debounce 타이머 정리
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    debouncedSearch();
  }, [searchValue, debouncedSearch]);

  return {
    searchValue,
    setSearchValue,
    searchResults,
    status,
    searchPlaces: debouncedSearch,
  };
};
