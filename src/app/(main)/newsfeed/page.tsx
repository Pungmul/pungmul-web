'use client'

import BottomTabs from "@pThunder/app/(main)/BottomTabs";
import { ReactElement, useEffect, useRef, useState } from "react";

export default function NewsFeed() {
  const [viewPart, setViewPart] = useState<'Follow' | 'Hot'>('Follow')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = 0;
  }, [viewPart])

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      <div
        ref={scrollRef}
        className="relative w-full flex-grow flex flex-col overflow-y-auto">
        {/** header 역할 */}
        <div
          style={{ height: 52, paddingLeft: 24, paddingRight: 24, gap: 12 }}
          className="z-10 flex-shrink-0 bg-white flex flex-row items-center justify-start sticky top-0">
          <div className="font-semibold cursor-pointer"
            style={{ color: viewPart == 'Follow' ? '#000' : '#B1B1B1' }}
            onClick={() => setViewPart('Follow')}>
            내 팔로잉
          </div>
          <div className="font-semibold cursor-pointer"
            style={{ color: viewPart == 'Hot' ? '#000' : '#B1B1B1' }}
            onClick={() => setViewPart('Hot')}>
            인기글
          </div>
        </div>
        <div className="flex-grow flex flex-col bg-gray-100" style={{ gap: 20 }}>
          {/* 게시글 묶음 */}
          {viewPart == 'Follow' ? <>
            <Feed />
            <BluredFeed />
            <Feed />
          </>
            :
            <>
              <BluredFeed />
              <BluredFeed />
            </>}
        </div>
      </div>
      <BottomTabs />
    </div>
  );
}
const BluredFeed = () => {

  return (
    <div className="flex flex-col bg-white relative" style={{ gap: 12, paddingTop: 12, paddingBottom: 12 }}>
      {/* 제목, 사람, 시간*/}
      <div className="flex flex-col" style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}>
        <div style={{ fontSize: 11, color: '#B7B7B7' }}>인기글</div>
        <div className="flex flex-row items-baseline" style={{ gap: 4 }}>
          <div style={{ fontSize: 16 }} className="font-semibold">방어 먹자 캤자나</div>
          <div style={{ fontSize: 11, color: '#B7B7B7' }} >in 노량진</div>
        </div>
        <div className="flex flex-row items-center justify-between">
          {/* 프로필 및 인원원 */}
          <div className="flex flex-row items-center justify-start" style={{ gap: 4 }}>
            <div className="rounded-full" style={{ width: 20, height: 20, backgroundColor: '#B7B7B7' }} />
            <div className="flex flex-row items-center justify-start" style={{ gap: 4, fontSize: 12, color: '#B7B7B7' }}>
              <div>아무개</div>
              <div>등 4명</div>
            </div>
          </div>
          {/* 시간 */}
          <div style={{ fontSize: 11, color: '#B7B7B7' }} >4시간 전</div>
        </div>
      </div>
      <div style={{ fontSize: 12, paddingLeft: 24, paddingRight: 24, whiteSpace: "pre-line", }} className="relative">
        <div style={{}}>
          {"오늘은 바다회 사랑을 갓따\n가니까 사람들이 무진장 마낫따\n"}
          <div
            style={{
              whiteSpace: "pre-line",
              filter: "blur(2.5px)", // 블러 효과
              pointerEvents: "none", // 클릭 방지
            }}
          >{
              "방어는 참 맛있었는데 살이 아리다\n내년엔 다시 안갈거 같다\n오늘에 일지 끗"
            }</div>
        </div>
        <div className="relative">
          <div className="absolute bottom-3 w-full flex flex-col items-center rounded-lg">
            {/* 버튼 */}
            <button className="bg-white px-4 py-2 rounded-full text-xs font-semibold shadow-md">
              팔로우 하고 더 읽기 →
            </button>
          </div>
        </div>
      </div>
      {/* 사진및 하단 상호 버튼 */}
      <div className="flex flex-col" style={{ gap: 16 }}>
        <div className="w-full relative">
          <div className="bg-gray-400 rounded-md" style={{ height: 220, marginLeft: 24, marginRight: 24, filter: "blur(2.5px)" }}>
          </div>
          <div className="absolute w-full flex flex-col items-center rounded-lg" style={{ top: 96 }}>
            {/* 버튼 */}
            <button className="bg-white px-4 py-2 rounded-full text-xs font-semibold shadow-md">
              팔로우 하고 더 보기 →
            </button>
          </div>
        </div>
        <div className="flex flex-row items-center " style={{ gap: 12, paddingLeft: 24, paddingRight: 24 }}>
          <div className="flex flex-row items-center">
            <div style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'black' }} />
            <div>25</div>
          </div>
          <div className="flex flex-row items-center">
            <div style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'black' }} />
            <div>25</div>
          </div>
          <div style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'black' }} />
        </div>
      </div>
    </div>
  )
}

const Feed = () => {

  return (
    <div className="flex flex-col bg-white relative" style={{ gap: 12, paddingTop: 12, paddingBottom: 12 }}>
      {/* 제목, 사람, 시간*/}
      <div className="flex flex-col" style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}>
        <div className="flex flex-row items-baseline" style={{ gap: 4 }}>
          <div style={{ fontSize: 16 }} className="font-semibold">방어 먹자 캤자나</div>
          <div style={{ fontSize: 11, color: '#B7B7B7' }} >in 노량진</div>
        </div>
        <div className="flex flex-row items-center justify-between">
          {/* 프로필 및 인원원 */}
          <div className="flex flex-row items-center justify-start" style={{ gap: 4 }}>
            <div className="rounded-full" style={{ width: 20, height: 20, backgroundColor: '#B7B7B7' }} />
            <div className="flex flex-row items-center justify-start" style={{ gap: 4, fontSize: 12, color: '#B7B7B7' }}>
              <div>아무개</div>
              <div>등 4명</div>
            </div>
          </div>
          {/* 시간 */}
          <div style={{ fontSize: 11, color: '#B7B7B7' }} >4시간 전</div>
        </div>
      </div>
      <div style={{ fontSize: 12, paddingLeft: 24, paddingRight: 24, whiteSpace: "pre-line" }}>
        {"오늘은 바다회 사랑을 갓따\n가니까 사람들이 무진장 마낫따\n방어는 참 맛있었는데 살이 아리다\n내년엔 다시 안갈거 같다\n오늘에 일지 끗"}
      </div>
      {/* 사진및 하단 상호 버튼 */}
      <div className="flex flex-col" style={{ gap: 16 }}>
        <div className="w-full relative">
          <div style={{ width: 32, height: 32, left: 8, top: 96 }} className="absolute rounded-full bg-black" />
          <div style={{ width: 32, height: 32, right: 8, top: 96 }} className="absolute rounded-full bg-black" />
          <div className="bg-gray-400 rounded-md" style={{ height: 220, marginLeft: 24, marginRight: 24 }}>
          </div>
        </div>
        <div className="flex flex-row items-center " style={{ gap: 12, paddingLeft: 24, paddingRight: 24 }}>
          <div className="flex flex-row items-center">
            <div style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'black' }} />
            <div>25</div>
          </div>
          <div className="flex flex-row items-center">
            <div style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'black' }} />
            <div>25</div>
          </div>
          <div style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'black' }} />
        </div>
      </div>
    </div>
  )
}