"use client";
import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { throttle } from "lodash";
import Image from "next/image";

import { SwiperRef } from "swiper/react";

import GpsMark from "@public/icons/Gps.svg";
import { AnimatePresence } from "framer-motion";
import { LightningOverlay } from "./widget/CreateLightningOverlay";
import {
  LightningMeeting,
} from "@/shared/types/lightning/type";
import {
  useUserParticipationStatus,
  useUserLocation,
  useUpdateUserLocation,
} from "@/features/lightning/api";

import { Responsive } from "@/shared/components/Responsive";
import { LightningModal } from "./widget/CreateLightningModal";
import "@/app/globals.css";

import "swiper/css";
import "swiper/css/pagination";
import { LightningInformation } from "./widget/LightningInformation";
import { useLightningSocket } from "../hooks/useLightning";
import { LightningCardList } from "./widget/LightningCardList";
import { participatingLightningStore } from "../store/participatingLightning";
  
type LocationType = {
  latitude: number;
  longitude: number;
};

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false`;

export default function LightningPage() {
  const { wholeLightningList, schoolLightningList, myInfo } =
    useLightningSocket();

  // TanStack Query 훅들 사용
  const {
    data: userParticipationData,
    isLoading: isParticipationLoading,
  } = useUserParticipationStatus();
  const { participatingLightning } = participatingLightningStore();

  const { data: serverUserLocation } = useUserLocation();

  const { mutate: updateLocation } = useUpdateUserLocation();

  const [currentLocation, setLocation] = useState<LocationType>();

  const [target, setTarget] = useState<"전체" | "우리학교">("전체");

  const lightningList = useMemo(()=>{
    if(target === "전체") return wholeLightningList;
    return schoolLightningList;
  },[target, wholeLightningList, schoolLightningList]);

  const [userPartinLightning, setUserPartinLightning] = useState<
    | (LightningMeeting & {
        isOrganizer: boolean;
        participationStatus: boolean;
        chatRoomUUID: string | null;
      })
    | null
  >(null);
  const [waitingView, setWaitingView] = useState(true);
  const [isLoading, setLoading] = useState(true);

  const isFirst = useRef(true);
  const GPSmarkerRef = useRef<KakaoMap>(null);
  const mapRef = useRef<KakaoMap>(null);
  const swiperRef = useRef<SwiperRef>(null);
  const markersRef = useRef<KakaoMap[]>([]);

  const moveMyLocation = useCallback(() => {
    if (currentLocation && mapRef.current) {
      const panToCenter = () => {
        const moveLatLon = new window.kakao.maps.LatLng(
          currentLocation.latitude,
          currentLocation.longitude
        );
        mapRef.current.panTo(moveLatLon);
        console.log("panto 호출");
      };
      panToCenter();
    }
  }, [currentLocation]);

  // TanStack Query 데이터를 기존 상태에 동기화
  useEffect(() => {
    if (userParticipationData) {
      setUserPartinLightning({
        ...userParticipationData.lightningMeeting,
        isOrganizer: userParticipationData.isOrganizer,
        participationStatus: userParticipationData.participant,
        chatRoomUUID: userParticipationData.chatRoomUUID,
      });
    }
  }, [userParticipationData]);

  useEffect(() => {
    if (lightningList.length === 0) return;
    if (mapRef.current) {
      markersRef.current.forEach((marker: KakaoMap) => {
        marker.setMap(null);
      });

      lightningList.forEach((lightningMeeting, index) => {
        const { latitude, longitude } = lightningMeeting;

        const panToCenter = () => {
          const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
          console.log("moveLatLon", moveLatLon);

          if (mapRef.current.getLevel() > 5) mapRef.current.setLevel(5);
          if (swiperRef.current) {
            swiperRef.current.swiper.slideTo(index);
          }
          setTimeout(() => {
            mapRef.current.panTo(moveLatLon);
          }, 10);
          console.log("panto 호출", index);
        };

        const circle = new window.kakao.maps.Circle({
          center: new window.kakao.maps.LatLng(latitude, longitude), // 원의 중심좌표 입니다
          radius: 500, // 미터 단위의 원의 반지름입니다
          strokeWeight: 1, // 선의 두께입니다
          strokeColor: "#5B2B99", // 선의 색깔입니다
          strokeOpacity: 0.6, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          fillColor: "#816DFF", // 채우기 색깔입니다
          fillOpacity: 0.2, // 채우기 불투명도 입니다
        });

        // 지도에 원을 표시합니다
        const mouseoverOption = {
          fillColor: "#816DFF", // 채우기 색깔입니다
          fillOpacity: 0.5, // 채우기 불투명도 입니다
        };

        // 다각형에 마우스아웃 이벤트가 발생했을 때 변경할 채우기 옵션입니다
        const mouseoutOption = {
          fillColor: "#816DFF", // 채우기 색깔입니다
          fillOpacity: 0.2, // 채우기 불투명도 입니다
        };

        // 다각형에 마우스오버 이벤트를 등록합니다
        window.kakao.maps.event.addListener(circle, "mouseover", function () {
          // 다각형의 채우기 옵션을 변경합니다
          circle.setOptions(mouseoverOption);
        });

        window.kakao.maps.event.addListener(circle, "mouseout", function () {
          // 다각형의 채우기 옵션을 변경합니다
          circle.setOptions(mouseoutOption);
        });
        window.kakao.maps.event.addListener(circle, "click", function () {
          panToCenter();
        });

        circle.setMap(mapRef.current);
        const imageSrc = "/icons/Thunder-Icon-colored.png", // 마커이미지의 주소입니다
          imageSize = new window.kakao.maps.Size(32, 32); // 마커이미지의 크기입니다
        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          { offset: new window.kakao.maps.Point(16, 16) }
        );
        const marker = new window.kakao.maps.Marker({
          image: markerImage,
          position: new window.kakao.maps.LatLng(latitude, longitude),
        });
        window.kakao.maps.event.addListener(marker, "click", function () {
          panToCenter();
        });
        marker.setMap(mapRef.current);
      });
    }
  }, [lightningList]);

  useEffect(() => {
    const { geolocation } = navigator;
    if (!geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }
    // 사용자의 위치가 변경될 때마다 실행되는 함수

    const loadLocation = (position: { coords: LocationType }) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      console.log("load location compconste");
      setLocation(newLocation); // 위치 상태 업데이트
    };

    // Kakao Map API를 로드하고 지도를 초기화하는 함수
    const loadKakaoMap = (position: { coords: LocationType }) => {
      const kakaoMapScript = document.createElement("script");
      kakaoMapScript.async = true;
      kakaoMapScript.src = KAKAO_SDK_URL;
      document.head.appendChild(kakaoMapScript);

      const onLoadKakaoAPI = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          const options = {
            center: new window.kakao.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            ),
            level: 1,
          };

          const mapInstance = new window.kakao.maps.Map(container, options);

          setLoading(false);
          mapRef.current = mapInstance;
        });
      };

      kakaoMapScript.addEventListener("load", onLoadKakaoAPI);
      // cleanup: 스크립트를 제거하고 이벤트 리스너 해제
      return () => {
        kakaoMapScript.removeEventListener("load", onLoadKakaoAPI);
        document.head.removeChild(kakaoMapScript);
      };
    };

    // 위치가 변경될 때마다 loadLocation을 호출하는 watchPosition 설정
    geolocation.getCurrentPosition(loadKakaoMap);

    const watchId = geolocation.watchPosition(
      throttle((position) => loadLocation(position), 10000),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.error("Permission denied for geolocation");
        } else {
          console.error("Geolocation error:", error);
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    // cleanup: 컴포넌트 언마운트 시 위치 추적 중단
    return () => {
      geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && currentLocation && mapRef.current) {
      console.log("currentLocation", currentLocation);
      const imageSrc = "/icons/gpsMarker.png", // 마커이미지의 주소입니다
        imageSize = new window.kakao.maps.Size(24, 24); // 마커이미지의 크기입니다
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        {
          offset: new window.kakao.maps.Point(12, 12),
        }
      );

      if (!GPSmarkerRef.current) {
        const marker = new window.kakao.maps.Marker({
          image: markerImage,
          map: mapRef.current,
          position: new window.kakao.maps.LatLng(
            currentLocation.latitude,
            currentLocation.longitude
          ),
        });

        GPSmarkerRef.current = marker;
      } else {
        GPSmarkerRef.current.setPosition(
          new window.kakao.maps.LatLng(
            currentLocation.latitude,
            currentLocation.longitude
          )
        );
      }
    }
  }, [currentLocation, isLoading]);

  // 위치 업데이트 로직을 TanStack Query로 변경
  useEffect(() => {
    if (currentLocation && serverUserLocation) {
      // 서버에 저장된 위치가 없거나 현재 위치와 다른 경우 업데이트
      if (
        !serverUserLocation ||
        serverUserLocation.latitude == null ||
        serverUserLocation.longitude == null
      ) {
        updateLocation({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });
      }
    }
  }, [currentLocation, serverUserLocation, updateLocation]);

  const onCardClick = useCallback((lightningMeeting: LightningMeeting) => {
    if (!mapRef.current) return;
    const { latitude, longitude } = lightningMeeting;
    const panToCenter = () => {
      const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
      mapRef.current?.panTo(moveLatLon);
      console.log("panto 호출");
    };
    panToCenter();
  }, []);

  return (
    <AnimatePresence mode="sync" key={"main-animate-presence"}>
      <section
        key="main-div"
        className="relative w-full h-full flex-grow flex flex-col justify-end lg:flex-row-reverse"
      >
        {(isLoading || isParticipationLoading) && !participatingLightning && (
          <div className="absolute z-20 bg-black bg-opacity-40 text-white w-full h-full flex flex-col items-center justify-center">
            로딩중...
          </div>
        )}
        <LightningInformation
          userPartinLightning={userPartinLightning}
          // setUserPartinLightning={setUserPartinLightning}
          waitingView={waitingView}
          isFirst={isFirst}
          setWaitingView={setWaitingView}
        />
        <div
          id="map"
          className="absolute flex-grow w-full mb-56 h-full lg:mb-0 lg:relative"
        >
          {!isLoading && (
            <div
              className="absolute w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg z-10 rounded-full bottom-[96px] bg-white right-4"
              onClick={moveMyLocation}
            >
              <Image
                src={GpsMark}
                fill
                content="contain"
                alt=""
                className="p-[8px]"
              />
            </div>
          )}
        </div>

        <div className="relative z-10 bottom-0 w-full rounded-xl shadow-up-md bg-white overflow-hidden flex flex-col lg:h-full lg:w-[640px] gap-[16px] py-[16px] lg:py-[32px] lg:gap-[24px]">
          <div className="px-4 text-lg font-semibold">
            내 주변에 발생한 <span style={{ color: "#BBFF00" }}>번개</span>
          </div>

          <div className="flex flex-row gap-2 px-[24px]">
            {(myInfo?.groupName !== null ? ["전체", "우리학교"] : ["전체"]).map(
              (item) => (
                <div
                  key={"target-option-" + item}
                  className={
                    "text-sm border border-[#816DFF] rounded-lg px-2 py-2 cursor-pointer " +
                    (target === item
                      ? "text-white bg-[#816DFF]"
                      : "text-[#816DFF]")
                  }
                  onClick={() => setTarget(item as "전체" | "우리학교")}
                >
                  {item}
                </div>
              )
            )}
          </div>

          <LightningCardList
            ref={swiperRef}
            lightningList={lightningList}
            userPartinLightning={userPartinLightning}
            onCardClick={onCardClick}
          />
        </div>
      </section>
      <Responsive
        mobile={
          userPartinLightning &&
          !userPartinLightning.participationStatus && (
            <Suspense fallback={<div>로딩중...</div>}>
              <LightningOverlay />
            </Suspense>
          )
        }
        desktop={
          userPartinLightning &&
          !userPartinLightning.participationStatus && (
            <Suspense fallback={<div>로딩중...</div>}>
              <LightningModal />
            </Suspense>
          )
        }
      />
    </AnimatePresence>
  );
}
