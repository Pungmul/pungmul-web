"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { throttle } from "lodash";
import Image from "next/image";
import GpsMark from "@public/icons/Gps.svg";
import { lightningMapStore } from "../../store/lightningMapStore";

type LocationType = {
  latitude: number;
  longitude: number;
};

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false`;

interface LightningMapProps {
  currentLocation?: LocationType | undefined;
  onLocationUpdate?: (location: LocationType) => void;
}

export function LightningMap({ currentLocation, onLocationUpdate }: LightningMapProps) {
  const { lightningList, focusLightningByIndex } = lightningMapStore();
  
  const [isLoading, setLoading] = useState(true);
  const GPSmarkerRef = useRef<KakaoMap>(null);
  const mapRef = useRef<KakaoMap>(null);
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

  // 지도 초기화
  useEffect(() => {
    const { geolocation } = navigator;
    if (!geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

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
          
          // 초기 위치 전달
          if (onLocationUpdate) {
            onLocationUpdate({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        });
      };

      kakaoMapScript.addEventListener("load", onLoadKakaoAPI);
      return () => {
        kakaoMapScript.removeEventListener("load", onLoadKakaoAPI);
        document.head.removeChild(kakaoMapScript);
      };
    };

    geolocation.getCurrentPosition(loadKakaoMap);

    const watchId = geolocation.watchPosition(
      throttle((position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        if (onLocationUpdate) {
          onLocationUpdate(newLocation);
        }
      }, 10000),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.error("Permission denied for geolocation");
        } else {
          console.error("Geolocation error:", error);
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => {
      geolocation.clearWatch(watchId);
    };
  }, [onLocationUpdate]);

  // Lightning 마커 업데이트
  useEffect(() => {
    if (lightningList.length === 0 || !mapRef.current) return;
    
    // 기존 마커들 제거
    markersRef.current.forEach((marker: KakaoMap) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    lightningList.forEach((lightningMeeting, index) => {
      const { latitude, longitude } = lightningMeeting;

      const panToCenter = () => {
        const moveLatLon = new window.kakao.maps.LatLng(latitude, longitude);
        console.log("moveLatLon", moveLatLon);

        if (mapRef.current.getLevel() > 5) mapRef.current.setLevel(5);
        setTimeout(() => {
          mapRef.current.panTo(moveLatLon);
        }, 10);
        console.log("panto 호출", index);
        
        // 해당 lightning에 포커스
        focusLightningByIndex(index);
      };

      // 원 생성
      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(latitude, longitude),
        radius: 500,
        strokeWeight: 1,
        strokeColor: "#5B2B99",
        strokeOpacity: 0.6,
        fillColor: "#816DFF",
        fillOpacity: 0.2,
      });

      const mouseoverOption = {
        fillColor: "#816DFF",
        fillOpacity: 0.5,
      };

      const mouseoutOption = {
        fillColor: "#816DFF",
        fillOpacity: 0.2,
      };

      window.kakao.maps.event.addListener(circle, "mouseover", function () {
        circle.setOptions(mouseoverOption);
      });

      window.kakao.maps.event.addListener(circle, "mouseout", function () {
        circle.setOptions(mouseoutOption);
      });
      
      window.kakao.maps.event.addListener(circle, "click", function () {
        panToCenter();
      });

      circle.setMap(mapRef.current);
      markersRef.current.push(circle);

      // 마커 생성
      const imageSrc = "/icons/Thunder-Icon-colored.png";
      const imageSize = new window.kakao.maps.Size(32, 32);
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
      markersRef.current.push(marker);
    });
  }, [lightningList, focusLightningByIndex]);

  // GPS 마커 업데이트
  useEffect(() => {
    if (!isLoading && currentLocation && mapRef.current) {
      const imageSrc = "/icons/gpsMarker.png";
      const imageSize = new window.kakao.maps.Size(24, 24);
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

  return (
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
  );
} 