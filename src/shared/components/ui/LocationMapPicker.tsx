"use client";
import { useCallback, useEffect,useMemo, useRef, useState } from "react";

import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { debounce } from "lodash";

import type { LocationType } from "@/features/location";
import { locationStore } from "@/features/location";

import { useKakaoMaps } from "../../hooks";
import { Spinner } from "./Spinner";

interface LocationMapPickerProps {
  initialLocation: LocationType | null | undefined;
  onLocationChange?: (location: LocationType, address: string) => void;
  showSearchBar?: boolean;
  className?: string;
}

export function LocationMapPicker({
  initialLocation,
  onLocationChange,
  showSearchBar = true,
  className = "",
}: LocationMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const getCurrentPosition = locationStore.getState().getCurrentPosition;
  const isInitializedRef = useRef(false);

  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<kakao.maps.services.PlacesSearchResultItem[]>([]);

  const { kakaoMapsLoaded, error, isInitializing } = useKakaoMaps();

  // 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (!kakaoMapsLoaded || isInitializedRef.current) return;

    const initializeMap = async () => {
      try {
        const location = initialLocation || (await getCurrentPosition());

        if (!location) {
          throw new Error("위치를 가져올 수 없습니다.");
        }

        const container = mapContainerRef.current;
        if (!container) return;

        const center = new window.kakao.maps.LatLng(location.latitude, location.longitude);
        const options = { center: center, level: 3 };
        const mapInstance = new window.kakao.maps.Map(container, options);
        const geocoder = new window.kakao.maps.services.Geocoder();

        const marker = new window.kakao.maps.Marker({
          position: center,
          map: mapInstance,
        });

        markerRef.current = marker;
        mapRef.current = mapInstance;
        isInitializedRef.current = true;

        const searchAddrFromCoords = (
          coords: kakao.maps.LatLng,
          callback: (
            result: Array<{
              address: kakao.maps.services.Address;
              road_address: kakao.maps.services.RoadAaddress | null;
            }>,
            status: kakao.maps.services.Status
          ) => void
        ) => {
          geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        };

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
              detailAddr = result[0].road_address.address_name;
            } else if (result[0]?.address) {
              detailAddr = result[0].address.address_name;
            }
            setCurrentAddress(detailAddr);
          }
        };

        searchAddrFromCoords(center, displayAddrInfo);

        // 지도 드래그 완료 시 콜백 호출
        window.kakao.maps.event.addListener(mapInstance, "dragend", function () {
          const latlng = mapInstance.getCenter();
          const newLocation = { latitude: latlng.getLat(), longitude: latlng.getLng() };
          marker.setPosition(latlng);
          
          searchAddrFromCoords(latlng, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              let detailAddr = "";
              if (result[0]?.road_address) {
                detailAddr = result[0].road_address.address_name;
              } else if (result[0]?.address) {
                detailAddr = result[0].address.address_name;
              }
              setCurrentAddress(detailAddr);
              
              // 여기서만 콜백 호출
              if (onLocationChange) {
                onLocationChange(newLocation, detailAddr);
              }
            }
          });
        });

        window.kakao.maps.event.addListener(mapInstance, "center_changed", function () {
          const latlng = mapInstance.getCenter();
          marker.setPosition(latlng);
        });
      } catch (error) {
        console.error("지도 초기화 에러:", error);
      }
    };

    initializeMap();
  }, [kakaoMapsLoaded]);

  // 장소 검색
  const searchPlaces = useCallback(() => {
    const keyword = searchValue.trim();
    if (!keyword || !mapRef.current) return;

    const ps = new kakao.maps.services.Places();
    const center = mapRef.current.getCenter();
    const userLocation = { latitude: center.getLat(), longitude: center.getLng() };

    ps.keywordSearch(
      keyword,
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      },
      {
        location: new kakao.maps.LatLng(userLocation.latitude, userLocation.longitude),
      }
    );
  }, [searchValue]);

  const debouncedSearch = useMemo(() => debounce(searchPlaces, 500), [searchPlaces]);

  useEffect(() => {
    if (searchValue) {
      debouncedSearch();
    }
    return () => debouncedSearch.cancel();
  }, [searchValue, debouncedSearch]);

  const handleSelect = useCallback((result: kakao.maps.services.PlacesSearchResultItem) => {
    const newLocation = { latitude: Number(result.y), longitude: Number(result.x) };
    const newAddress = result.place_name;
    
    setCurrentAddress(newAddress);
    setSearchValue("");

    // 콜백 호출
    if (onLocationChange) {
      onLocationChange(newLocation, newAddress);
    }

    const latlng = new window.kakao.maps.LatLng(Number(result.y), Number(result.x));
    mapRef.current?.panTo(latlng);
    markerRef.current?.setPosition(latlng);
  }, [onLocationChange]);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="text-grey-600">{error}</div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showSearchBar && (
        <div className="relative w-full flex flex-col gap-2">
          <div className="flex flex-row gap-2 p-2 rounded-lg bg-grey-100 border border-grey-100 focus-within:border-grey-400">
            <MagnifyingGlassIcon className="size-6 text-grey-400" />
            <input
              type="text"
              className="flex-grow bg-transparent outline-none font-light border-none"
              placeholder="주소 검색"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue.trim() !== "" && (
              <XCircleIcon
                className="size-6 cursor-pointer text-grey-400"
                onClick={() => setSearchValue("")}
              />
            )}
          </div>

          {searchValue.trim() !== "" && searchResults.length > 0 && (
            <div className="absolute bg-background top-full left-0 w-full z-10 flex flex-col gap-2 overflow-y-auto max-h-[200px] border border-grey-200 rounded-lg shadow-lg">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="flex flex-col gap-1 px-3 py-2 cursor-pointer hover:bg-grey-100"
                  onClick={() => handleSelect(result)}
                >
                  <div className="text-sm font-medium text-grey-800">{result.place_name}</div>
                  <div className="text-xs text-grey-600">
                    {result.road_address_name || result.address_name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        ref={mapContainerRef}
        className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-grey-200"
      />

      {currentAddress && (
        <div className="text-sm text-grey-600 bg-grey-100 p-3 rounded-lg">
          <p className="font-medium">선택된 주소:</p>
          <p className="font-semibold text-grey-800">{currentAddress}</p>
          <p className="text-xs text-grey-500 mt-1">
            지도를 드래그하여 원하는 위치를 선택하세요
          </p>
        </div>
      )}
    </div>
  );
}
