"use client"
import { Header } from "@pThunder/app/component/Header";
import { useEffect, useState } from "react";

import Image from "next/image";

import LocationIcon from '@public/Location-icon.svg';
import { useRouter } from "next/navigation";

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

export default function LightningCreateCheckPage() {

    const router = useRouter();
    const [title, setTitle] = useState('')
    const [lightningType, setLightningType] = useState<string | null>(null)
    const [location, setLocation] = useState<string | null>(null)

    useEffect(() => {
        const { geolocation } = navigator;
        if (!geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }
        // 사용자의 위치가
        // Kakao Map API를 로드하고 지도를 초기화하는 함수
        const loadKakaoMap = (position: { coords: LocationType }) => {
            const kakaoMapScript = document.createElement('script');
            kakaoMapScript.async = true;
            kakaoMapScript.src = KAKAO_SDK_URL;
            document.head.appendChild(kakaoMapScript);

            const getBuildingInfo = async () => {
                const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${position.coords.longitude}&y=${position.coords.latitude}`, {
                    headers: {
                        "Authorization": `KakaoAK ${process.env.NEXT_PUBLIC_REST_API_KEY}`
                    }
                })

                if (response.ok) {
                    const { documents } = await response.json();
                    console.log(documents)
                    if (documents.length == 0) return
                    const { road_address, address } = await documents[0];
                    if (!!road_address) {
                        const { building_name, address_name } = await road_address;
                        setLocation(building_name + ` (${address_name})`)
                    } else if (!!address) {
                        const { address_name } = await address;
                        setLocation(address_name)
                    }
                }
            }

            const onLoadKakaoAPI = () => {
                window.kakao.maps.load(() => {
                    const container = document.getElementById('map');
                    const options = {
                        center: new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        level: 3,
                        draggable: false,
                        scrollwheel: false,
                        disableDoubleClick: true,
                        keyboardShortcuts: false
                    };

                    const mapInstance = new window.kakao.maps.Map(container, options);

                    var circle = new window.kakao.maps.Circle({
                        center: new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),  // 원의 중심좌표 입니다 
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
                    var imageSrc = '/gpsMarker.png', // 마커이미지의 주소입니다    
                        imageSize = new window.kakao.maps.Size(24, 24) // 마커이미지의 크기입니다
                    var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, { offset: new window.kakao.maps.Point(12, 12) })
                    const marker = new window.kakao.maps.Marker({
                        image: markerImage,
                        position: new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude)
                    })
                    marker.setMap(mapInstance);
                });
            };

            kakaoMapScript.addEventListener('load', onLoadKakaoAPI);
            kakaoMapScript.addEventListener('load', getBuildingInfo);
            // cleanup: 스크립트를 제거하고 이벤트 리스너 해제
            return () => {
                kakaoMapScript.removeEventListener('load', onLoadKakaoAPI);
                document.head.removeChild(kakaoMapScript);
            };
        };

        // 위치가 변경될 때마다 loadLocation을 호출하는 watchPosition 설정
        geolocation.getCurrentPosition(loadKakaoMap)

    }, []);

    return (
        <div className="flex flex-col h-full w-full">
            <Header title="번개 정보 확인" />
            <div id="map" className="flex-grow w-full">

            </div>
            <div className="flex flex-col flex-grow">
                <div
                    style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 36, gap: 24 }}
                    className="w-full flex flex-col"
                >
                    <div className="flex flex-row justify-between" style={{ paddingLeft: 4, paddingRight: 4 }}>
                        <div style={{ fontSize: 14, color: '#9A9A9A' }}>위치</div>
                        <div className="flex flex-row items-center justify-center" style={{ gap: 4 }}>
                            <Image src={LocationIcon} width={24} alt="" /> <div style={{ fontSize: 14 }}>{location}</div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center" style={{ height: 24, paddingLeft: 4, paddingRight: 4 }}>
                        <div style={{ fontSize: 14, color: '#9A9A9A' }}>번개 이름</div>
                        <div style={{ fontSize: 14 }}>
                            {location}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center" style={{ height: 24, paddingLeft: 4, paddingRight: 4 }}>
                        <div style={{ fontSize: 14, color: '#9A9A9A' }}>타입</div>
                        <div style={{ fontSize: 14 }}>
                            {location}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center" style={{ height: 24, paddingLeft: 4, paddingRight: 4 }}>
                        <div style={{ fontSize: 14, color: '#9A9A9A' }}>최소 인원</div>
                        <div style={{ fontSize: 14 }}>
                            {location}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center" style={{ height: 24, paddingLeft: 4, paddingRight: 4 }}>
                        <div style={{ fontSize: 14, color: '#9A9A9A' }}>최대 인원</div>
                        <div style={{ fontSize: 14 }}>
                            {location}
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center" style={{ height: 24, paddingLeft: 4, paddingRight: 4 }}>
                        <div style={{ fontSize: 14, color: '#9A9A9A' }}>시작 시간</div>
                        <div style={{ fontSize: 14 }}>
                            {location}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full py-4"
                style={{ paddingLeft: 24, paddingRight: 24 }}>
                <div className="w-full flex items-center justify-center text-white rounded"
                    style={{ height: 48, backgroundColor: '#816DFF', cursor: 'pointer' }}
                    onClick={()=>{router.replace('/lightning')}}>생성하기</div>
            </div>
        </div>
    )
}