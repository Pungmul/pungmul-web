'use client'

import { useRouter } from "next/navigation";

import Image from "next/image";

import MyPageIcon from '@public/MyPage-Icon.svg';
import NotificationIcon from '@public/Notification-Icon.svg'
import ChevronRightIcon from '@public/Chevron-right-icon.svg'
import LocationIcon from '@public/Location-icon.svg'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FreeMode } from "swiper/modules";
import { useEffect } from "react";

interface RecentPost {
  postId: number;
  title: string;
  content: string;
  viewCount: number;
  likedNum: number;
  timeSincePosted: number;
  timeSincePostedText: string;
  author: string;
}


export default function Home() {
  const router = useRouter();
  const today = new Date()
  const testPosts: RecentPost[] = [
    {
      postId: 5,
      author: '익명',
      title: 'test',
      content: '테스트를 위해 만들어진 양식입니다.',
      likedNum: 1,
      viewCount: 5,
      timeSincePosted: today.getTime(),
      timeSincePostedText: "2024-12-12T10:53:07.692Z"
    },
    {
      postId: 55,
      author: '익명',
      title: 'test2',
      content: '테스트를 위해 만들어진 양식입니다.',
      likedNum: 1,
      viewCount: 5,
      timeSincePosted: today.getTime(),
      timeSincePostedText: "2024-12-12T10:53:07.692Z"
    },
    {
      postId: 4,
      author: '익명',
      title: 'test3',
      content: '테스트를 위해 만들어진 양식입니다.',
      likedNum: 1,
      viewCount: 5,
      timeSincePosted: today.getTime(),
      timeSincePostedText: "2024-12-12T10:53:07.692Z"
    },
    {
      postId: 1,
      author: '익명',
      title: 'test4',
      content: '테스트를 위해 만들어진 양식입니다.',
      likedNum: 1,
      viewCount: 5,
      timeSincePosted: today.getTime(),
      timeSincePostedText: "2024-12-12T10:53:07.692Z"
    },
  ]

  useEffect(() => {

    const issueToken = async (tokens: { accessToken: string, refreshToken: string }) => {

      try {
        const res = await fetch('/cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tokens),
        });

        if (res.ok) {
          console.log('✅ 쿠키 설정 완료');
          if (typeof window === "undefined" || !window?.ReactNativeWebView) {
            return;
          }
          window?.ReactNativeWebView.postMessage(JSON.stringify('Cookie issued'));
        }
        else throw Error('Failed to issue cookies')
      }
      catch {
        console.log('⛔ 쿠키 설정 실패');
          if (typeof window === "undefined" || !window?.ReactNativeWebView) {
            return;
          }
          window?.ReactNativeWebView.postMessage(JSON.stringify('Cookie didn\'t issue'));
      }

    }

    const handleMessage = (event: MessageEvent) => {
      
      const isReactNativeWebView = () => {
        if (typeof window !== 'undefined') {
          return /React-Native/i.test(window.navigator.userAgent);
        }
        return false;
      }

      const isWebView = isReactNativeWebView()

      if (isWebView) {
        const { accessToken, refreshToken } = JSON.parse(event.data);
        if (!accessToken || !refreshToken) return;

        issueToken({ accessToken, refreshToken })
      }

    };

    document.addEventListener('message', handleMessage as EventListener);
    window.addEventListener('message', handleMessage);

    return () => {

      document.addEventListener('message', handleMessage as EventListener);
      window.removeEventListener('message', handleMessage);

    }
  }, []);

  return (
    <div className="flex flex-col w-full overflow-y-auto">
      <div className="relative w-full h-full flex-grow flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        <div className="flex flex-row justify-end" style={{ paddingTop: 36, paddingBottom: 4, paddingLeft: 24, paddingRight: 24, gap: 8 }}>
          <Image src={NotificationIcon} width={36} alt="" />
          <Image src={MyPageIcon} width={36} alt="" className="cursor-pointer" onClick={() => router.push('/my-page')} />
        </div>
        <div className="flex flex-col">
          <div style={{ paddingLeft: 24, paddingRight: 24, fontSize: 16, fontWeight: 600 }}>
            내 모임
          </div>
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={16}
            freeMode={true}
            modules={[FreeMode]}
            style={{ paddingTop: 24, paddingBottom: 24 }}
            className="w-full h-full mySwiper"
          >
            <>
              <SwiperSlide style={{ width: 12 }} className="flex-shrink-0">
              </SwiperSlide>
              {Array.from({ length: 8 }).map((_, index) => (
                <SwiperSlide style={{ width: 140, height: 120 }} className="cursor-pointer"
                  onClick={() => router.push('/meeting')}>
                  <div key={index + 'moim'} className="w-full h-full rounded-md flex-shrink-0 bg-gray-400 overflow-hidden flex flex-col shadow-md" >
                    <div className="flex-grow">
                    </div>
                    <div
                      className="bg-white"
                      style={{
                        padding: '6px 8px'
                      }}>
                      <div className="line-clamp-2 overflow-hidden w-full" style={{
                        fontSize: 11,
                        lineHeight: '120%', // 줄 간격
                      }}
                      >
                        모임이름은 최대몇글짜까지표시됩니다리우스웨인버스라크라우치머리헤딩딩
                      </div>
                    </div>

                  </div>
                </SwiperSlide>

              ))}
              <SwiperSlide style={{ width: 12 }} className="flex-shrink-0">
              </SwiperSlide>
            </>
          </Swiper>

        </div>
        <div className="flex flex-col" style={{ gap: 20, paddingBottom: 32 }}>
          <div className="flex flex-row justify-between items-center" style={{ paddingLeft: 24, paddingRight: 24, }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>다가오는 일정</div>
            <Image src={ChevronRightIcon} width={20} alt="" className="cursor-pointer" />
          </div>
          <div style={{ paddingLeft: 26, paddingRight: 26 }}>
            <div className="flex flex-col bg-white" style={{ gap: 12, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, boxShadow: '0.25px 0.5px 6px 0px rgba(0, 0, 0, 0.15)', borderRadius: 5 }}>
              <div style={{ fontSize: 13, color: '#898989' }}>내 모임 이름</div>
              <div className="flex flex-row items-center" style={{ gap: 4 }}>
                <div style={{ fontSize: 13, color: '#898989' }}>2024.11.08(월)</div>
                <div style={{ fontSize: 13, color: '#898989' }}>(D-7)</div>
              </div>
              <div style={{ fontSize: 16 }}>약속 이름</div>
              <div className="flex flex-col" style={{ gap: 6 }}>
                <div className="flex flex-row items-center" style={{ gap: 4 }}>
                  <Image src={LocationIcon} width={16} color="#898989" alt="" />
                  <div style={{ fontSize: 11, color: '#898989' }}>장소</div>
                </div>
                <div className="flex flex-row items-center" style={{ gap: 4 }}>
                  <div style={{ width: 16, height: 16 }} className="bg-gray-300"></div>
                  <div style={{ fontSize: 11, color: '#898989' }}>시간</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col" style={{ gap: 20, paddingBottom: 32 }}>
          <div className="flex flex-row items-center" style={{ paddingLeft: 24, paddingRight: 24, fontSize: 16, fontWeight: 600 }}>
            지금 뜨는 인기글
          </div>
          <div style={{ paddingLeft: 26, paddingRight: 26 }}>
            <div className="flex flex-col overflow-hidden" style={{ boxShadow: '0.25px 0.5px 6px 0px rgba(0, 0, 0, 0.15)', borderRadius: 5 }}>
              {testPosts.map(post => (
                <div key={post.postId} style={{ gap: 8, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 }} className={`w-full bg-white flex flex-col px-6 border-b cursor-pointer`}
                >
                  <div className="flex justify-between flex-col items-start">
                    <div style={{ fontSize: 14 }} className="w-full truncate">{post.title}</div>
                    <div style={{ fontSize: 12 }} className="text-gray-300 max-w-24 truncate">{post.author == 'Anonymous' ? '익명' : post.author}</div>
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-between">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="flex flex-row items-center gap-1">
                        <div style={{ width: 12, height: 12 }} className=" bg-red-200" />
                        <div style={{ fontSize: 11 }} className="text-red-200" >{post.likedNum}</div>
                      </div>
                      <div className="flex flex-row items-center gap-1">
                        <div style={{ width: 12, height: 12 }} className=" bg-gray-200" />
                        <div style={{ fontSize: 11 }} >{post.viewCount}</div>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2  items-end">
                      <div className="flex flex-row gap-1 items-center">
                        <div className="text-gray-400 text-xs">{post.timeSincePostedText}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div style={{ paddingLeft: 24, paddingRight: 24, fontSize: 16, fontWeight: 600 }}>
            공연 홍보
          </div>
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={16}
            freeMode={true}
            style={{ paddingTop: 24, paddingBottom: 24 }}
            modules={[FreeMode]}
            className="w-full h-full mySwiper"
          >
            <>
              <SwiperSlide style={{ width: 12 }} className="flex-shrink-0">
                <div>
                </div>
              </SwiperSlide>
              {Array.from({ length: 8 }).map((_, index) => (
                <SwiperSlide key={index + 'hongbo'} style={{ width: 140, height: 194 }} className="cursor-pointer">
                  <div className="rounded-md flex-shrink-0 w-full h-full  bg-gray-400 overflow-hidden flex flex-col shadow-md" >
                    <div className="flex-grow">

                    </div>
                    <div className="bg-white w-full flex flex-col" style={{ paddingTop: 6, paddingBottom: 6, paddingLeft: 8, paddingRight: 8, height: 44, gap: 'auto' }}>
                      <div className="truncate w-full" style={{ fontSize: 11, color: '#808080' }}>
                        공연이름은 최대몇글짜까지표시됩니다리우스웨인버스라크라우치머리헤딩딩
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="truncate" style={{ fontSize: 11, color: '#808080' }}>
                          2024.11.08(월)
                        </div>
                        <div className="flex flex-row items-center gap-1 flex-shrink-0">
                          <div style={{ width: 12, height: 12 }} className=" bg-gray-200" />
                          <div style={{ fontSize: 11 }} >50</div>
                        </div>
                      </div>

                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <SwiperSlide style={{ width: 12 }} className="flex-shrink-0">
                <div>
                </div>
              </SwiperSlide>
            </>
          </Swiper>
        </div>
      </div>
    </div>
  );
}
