'use client'
import "@pThunder/app/globals.css";
import { useCallback, useEffect, useState } from "react";


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

export default function Home() {
  const [currentLocation, setLocation] = useState<LocationType>()
  const [isLoading, setLoading] = useState(true);
  const [map, setMap] = useState<any>()

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
      setLocation(newLocation); // 위치 상태 업데이트
      if (isLoading) {
        setLoading(false)
        loadKakaoMap(newLocation)
      }
    };

    // Kakao Map API를 로드하고 지도를 초기화하는 함수
    const loadKakaoMap = (location: LocationType) => {
      const kakaoMapScript = document.createElement('script');
      kakaoMapScript.async = true;
      kakaoMapScript.src = KAKAO_SDK_URL;
      document.head.appendChild(kakaoMapScript);

      const onLoadKakaoAPI = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new window.kakao.maps.LatLng(location.latitude, location.longitude),
            level: 1
          };

          const mapInstance = new window.kakao.maps.Map(container, options);
          setMap(mapInstance);

          var circle = new window.kakao.maps.Circle({
            center: new window.kakao.maps.LatLng(location.latitude, location.longitude),  // 원의 중심좌표 입니다 
            radius: 100, // 미터 단위의 원의 반지름입니다 
            strokeWeight: 1, // 선의 두께입니다 
            strokeColor: '#5B2B99', // 선의 색깔입니다
            strokeOpacity: 0.6, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            fillColor: '#816DFF', // 채우기 색깔입니다
            fillOpacity: 0.2  // 채우기 불투명도 입니다   
          });

          // 지도에 원을 표시합니다 
          var mouseoverOption = {
            fillColor: '#816DFF', // 채우기 색깔입니다
            fillOpacity: 0.5  // 채우기 불투명도 입니다   
          };

          // 다각형에 마우스아웃 이벤트가 발생했을 때 변경할 채우기 옵션입니다
          var mouseoutOption = {
            fillColor: '#816DFF', // 채우기 색깔입니다
            fillOpacity: 0.2  // 채우기 불투명도 입니다   
          };

          // 다각형에 마우스오버 이벤트를 등록합니다
          window.kakao.maps.event.addListener(circle, 'mouseover', function () {

            // 다각형의 채우기 옵션을 변경합니다
            circle.setOptions(mouseoverOption);

          });

          window.kakao.maps.event.addListener(circle, 'mouseout', function () {

            // 다각형의 채우기 옵션을 변경합니다
            circle.setOptions(mouseoutOption);

          });
          circle.setMap(mapInstance);
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
    const watchId = geolocation.watchPosition(
      loadLocation,
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

      const marker = new window.kakao.maps.Marker({
        image: markerImage,
        map: map,
        position: new window.kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude)
      })
    }
  }, [currentLocation, isLoading, map])

  return (
    <div className="relative w-full h-full flex flex-col">
      {isLoading && <div className="absolute z-20 bg-black bg-opacity-40 text-white w-full h-full flex flex-col items-center justify-center">
        로딩중...
      </div>}
      <div id="map" className="relative flex-grow w-full mb-56 h-full">
        {!isLoading &&
          <div className="absolute w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg z-10 rounded-full bottom-12 bg-white right-4"
            onClick={moveMyLocation}>
            <img src="/gps.png" className="w-8 h-8" sizes="cover" />
          </div>}
      </div>
      <div className="absolute z-10 bottom-0 w-full h-64 rounded-xl shadow-up-md bg-white overflow-hidden flex flex-col">
        <div className="mx-4 my-4 text-lg">현재 모집중인 번개</div>
        <div className="w-full overflow-x-scroll h-full my-4 scroll-bar-hidden">
          <div className="flex flex-row w-auto h-full gap-4">
            {[1, 2, 3].map(element =>
              <div key={element} className="flex-shrink-0 w-4/5 px-12">
                <Card />
              </div>)}
          </div>
        </div>

      </div>
    </div>
  );
}


const Card: React.FC = () => {
  return (
    <div className="h-full w-full rounded-md bg-black text-white ">
      sss
    </div>
  )
}