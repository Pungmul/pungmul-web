'use client'
import "@pThunder/app/globals.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { throttle } from "lodash";
import Image from "next/image";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import GpsMark from '@public/Gps.svg';

import BottomTabs from "@pThunder/app/(main)/BottomTabs";
import { useRouter } from "next/navigation";
import SockJS from "sockjs-client";
import { Client, Stomp } from "@stomp/stompjs";

declare global {
  interface Window {
    kakao: any;
  }
}

type LocationType = {
  latitude: number;
  longitude: number;
};

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false`;

export function mySocketFactory() {
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL // || 'http://3.37.163.10:8080';

  return new SockJS(`http://pungmul.site/ws/api/lightning/nearby`);
}

const useLightningSocket = () => {
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is not found');
      return;
    }
    const socket = mySocketFactory();
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`,  // JWT 토큰 추가
      },
      onConnect: () => {
        console.log('Connected to WebSocket');

        // 서버로부터 메시지 수신
        client.subscribe('/sub/lightning-meeting/nearby', (response) => {
          console.log('Received message:', response.body);
        });

        // 메시지 발행 예제

      },
      onStompError: (frame) => {
        console.error('Broker reported error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      console.log('WebSocket disconnected');
    };
  }, []);

  return stompClientRef.current;
};

export default function Lightning() {

  const lightningSocket = useLightningSocket();
  const [currentLocation, setLocation] = useState<LocationType>()
  const [isLoading, setLoading] = useState(true);
  const [map, setMap] = useState<any>()
  const [GPSmarker, setGPSMarker] = useState<any>();
  const router = useRouter();

  const moveMyLocation = useCallback(() => {
    if (currentLocation && map) {
      const panToCenter = () => {
        var moveLatLon = new window.kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
        map.panTo(moveLatLon);
        console.log('panto 호출')
      }
      panToCenter()
    }
  }, [currentLocation, map])

  const sendLocation = useCallback((location: LocationType) => {
    lightningSocket?.publish({
      destination: '/pub/lightning-meeting/nearby',
      body: JSON.stringify({
        ...location,
        mapLevel: 7
      }),
    });
  }, [])
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
        longitude: position.coords.longitude
      };
      console.log('load location complete')
      setLocation(newLocation); // 위치 상태 업데이트
    };

    // Kakao Map API를 로드하고 지도를 초기화하는 함수
    const loadKakaoMap = (position: { coords: LocationType }) => {
      const kakaoMapScript = document.createElement('script');
      kakaoMapScript.async = true;
      kakaoMapScript.src = KAKAO_SDK_URL;
      document.head.appendChild(kakaoMapScript);

      const onLoadKakaoAPI = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),
            level: 1
          };

          const mapInstance = new window.kakao.maps.Map(container, options);
          setMap(mapInstance);

          sendLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
          // var circle = new window.kakao.maps.Circle({
          //   center: new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),  // 원의 중심좌표 입니다 
          //   radius: 100, // 미터 단위의 원의 반지름입니다 
          //   strokeWeight: 1, // 선의 두께입니다 
          //   strokeColor: '#5B2B99', // 선의 색깔입니다
          //   strokeOpacity: 0.6, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          //   fillColor: '#816DFF', // 채우기 색깔입니다
          //   fillOpacity: 0.2  // 채우기 불투명도 입니다   
          // });

          // // 지도에 원을 표시합니다 
          // var mouseoverOption = {
          //   fillColor: '#816DFF', // 채우기 색깔입니다
          //   fillOpacity: 0.5  // 채우기 불투명도 입니다   
          // };

          // // 다각형에 마우스아웃 이벤트가 발생했을 때 변경할 채우기 옵션입니다
          // var mouseoutOption = {
          //   fillColor: '#816DFF', // 채우기 색깔입니다
          //   fillOpacity: 0.2  // 채우기 불투명도 입니다   
          // };

          // // 다각형에 마우스오버 이벤트를 등록합니다
          // window.kakao.maps.event.addListener(circle, 'mouseover', function () {

          //   // 다각형의 채우기 옵션을 변경합니다
          //   circle.setOptions(mouseoverOption);

          // });

          // window.kakao.maps.event.addListener(circle, 'mouseout', function () {

          //   // 다각형의 채우기 옵션을 변경합니다
          //   circle.setOptions(mouseoutOption);

          // });
          // circle.setMap(mapInstance);

          setLoading(false)
        });
      };

      kakaoMapScript.addEventListener('load', onLoadKakaoAPI);
      // cleanup: 스크립트를 제거하고 이벤트 리스너 해제
      return () => {
        kakaoMapScript.removeEventListener('load', onLoadKakaoAPI);
        document.head.removeChild(kakaoMapScript);
      };
    };

    // 위치가 변경될 때마다 loadLocation을 호출하는 watchPosition 설정
    geolocation.getCurrentPosition(loadKakaoMap)
    const watchId = geolocation.watchPosition(
      (throttle((position) => loadLocation(position), 10000)),
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
    if (!isLoading && currentLocation && map) {
      var imageSrc = '/gpsMarker.png', // 마커이미지의 주소입니다    
        imageSize = new window.kakao.maps.Size(24, 24) // 마커이미지의 크기입니다
      var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, { offset: new window.kakao.maps.Point(12, 12) })

      if (!GPSmarker) {
        const marker = new window.kakao.maps.Marker({
          image: markerImage,
          map: map,
          position: new window.kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude)
        })

        setGPSMarker(marker)
      }
      else {
        GPSmarker.setPosition(new window.kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude))
      }
    }
  }, [currentLocation, isLoading, map])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative w-full h-full flex-grow flex flex-col">
        {isLoading && <div className="absolute z-20 bg-black bg-opacity-40 text-white w-full h-full flex flex-col items-center justify-center">
          로딩중...
        </div>}
        <div id="map" className="relative flex-grow w-full mb-56 h-full">
          {!isLoading &&
            <div className="absolute w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg z-10 rounded-full bottom-12 bg-white right-4"
              onClick={moveMyLocation}>
              <Image src={GpsMark} width={32} alt="" />
            </div>}
        </div>
        <div className="absolute z-10 bottom-0 w-full h-64 rounded-xl shadow-up-md bg-white overflow-hidden flex flex-col">
          <div className="mx-4 my-4 text-lg font-semibold">내 주변에 발생한 <span style={{ color: '#BBFF00' }}>번개</span></div>

          <Swiper
            slidesPerView={'auto'}
            spaceBetween={36}
            centeredSlides={true}
            pagination={
              {
                dynamicBullets: true,
                clickable: true,
              }
            }
            modules={[Pagination]}
            className="w-full h-full"
          >
            {/* 스와이프 영역 */}
            <>
              {[1, 2, 3].map(element =>
                <SwiperSlide style={{ width: 270, height: 160 }}>
                  <div key={element} className="flex-shrink-0 h-full">
                    <Card>
                      {element}번 카드

                    </Card>
                  </div>
                </SwiperSlide>
              )}
              <SwiperSlide style={{ width: 270, height: 160 }}>
                <div className="flex-shrink-0 h-full">
                  {/* 카드 추가하기 버튼 */}
                  <Card>
                    <div onClick={() => router.push('lightning/create')}>추가하기</div>
                  </Card>
                </div>
              </SwiperSlide>
            </>
          </Swiper>
        </div>
      </div>
      {/* 바텀탭 영역역 */}
      <BottomTabs />
    </div>
  );
}


const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-full rounded-md w-full bg-black text-white">
      {children}
    </div>
  )
}