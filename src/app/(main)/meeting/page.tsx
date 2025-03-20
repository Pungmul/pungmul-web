'use client'
import { Header } from "@pThunder/app/component/header";
import { useRouter } from "next/navigation";

import Image from "next/image";

import ChevronRightIcon from '@public/Chevron-right-icon.svg'
import LocationIcon from '@public/Location-icon.svg'
import MeetingBottomTabs from "./MeetingBottomTabs";


export default function MyPagePage() {

    const router = useRouter();

    return (
        <div className="flex flex-col h-full">
            <Header title="모임 이름" />
            <div className="flex flex-col flex-grow relative overflow-y-auto" style={{scrollbarWidth:'thin'}}>
                <div className="z-0 w-full bg-gray-400 flex-shrink-0" style={{ height: 210 }} />
                <div className="z-10 bg-gray-100 flex flex-col" style={{gap:16, marginTop: -50, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <div className="flex flex-row items-center justify-between bg-white" style={{ padding: '12px 24px', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <div style={{ fontSize: 18, fontWeight: 600 }}>우리 모임 이름</div>
                        <div className="flex flex-col" style={{ gap: 4 }}>
                            <div style={{ fontSize: 12, color: '#B7B7B7', textAlign: 'right', height: 16 }}>2024.10.08</div>
                            <div style={{ fontSize: 12, color: '#B7B7B7', textAlign: 'right', height: 16 }}>(D+264)</div>
                        </div>
                    </div>
                    <div className="flex flex-col" style={{ margin: '0 24px', gap: 16 }}>

                        <div className="flex flex-row justify-between items-center" style={{ paddingLeft: 4, paddingRight: 4, }}>
                            <div style={{ fontSize: 16, fontWeight: 600 }}>다가오는 일정</div>
                            <Image src={ChevronRightIcon} width={20} alt="" className="cursor-pointer" />
                        </div>

                        <div style={{ paddingLeft: 2, paddingRight: 2 }}>
                            <div className="flex flex-col bg-white" style={{ gap: 12, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, boxShadow: '0.25px 0.5px 6px 0px rgba(0, 0, 0, 0.15)', borderRadius: 5 }}>
                                <div className="flex flex-row items-center" style={{ gap: 4 }}>
                                    <div style={{ fontSize: 13, color: '#898989' }}>2024.11.08(월)</div>
                                    <div style={{ fontSize: 13, color: '#898989' }}>(D-7)</div>
                                </div>
                                <div style={{ fontSize: 16, lineHeight:'100%' }}>약속 이름</div>
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
                        <div style={{ paddingLeft: 2, paddingRight: 2 }}>
                            <div className="flex flex-col bg-white" style={{ gap: 12, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, boxShadow: '0.25px 0.5px 6px 0px rgba(0, 0, 0, 0.15)', borderRadius: 5 }}>
                                <div className="flex flex-row items-center" style={{ gap: 4 }}>
                                    <div style={{ fontSize: 13, color: '#898989' }}>2024.11.08(월)</div>
                                    <div style={{ fontSize: 13, color: '#898989' }}>(D-7)</div>
                                </div>
                                <div style={{ fontSize: 16, lineHeight:'100%' }}>약속 이름</div>
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
                        <div className="px-3 py-1 text-[#ababab] text-base font-bold bg-white rounded-[20px] border border-[#ababab] self-center gap-2.5 cursor-pointer">
                            더보기
                        </div>
                    </div>
                    <Feed />
                    <Feed />
                </div>
            </div>
            <MeetingBottomTabs />
        </div>

    )
}

const Feed = () => {

    return (
        <div className="flex flex-col bg-white relative" style={{ gap: 12, paddingTop: 12, paddingBottom: 12 }}>
            {/* 제목, 사람, 시간*/}
            <div className="flex flex-col" style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}>
                <div style={{ fontSize: 16 }} className="font-semibold">방어 먹자 캤자나</div>
                <div className="flex flex-row items-center justify-between">
                    {/* 프로필 및 인원원 */}
                    <div className="flex flex-row items-center justify-start" style={{ gap: 4 }}>
                        <div className="rounded-full" style={{ width: 20, height: 20, backgroundColor: '#B7B7B7' }} />
                        <div style={{ fontSize: 12, color: '#B7B7B7' }}>아무개</div>
                    </div>
                    {/* 시간 */}
                    <div style={{ fontSize: 11, color: '#B7B7B7' }} >4시간 전</div>
                </div>
            </div>
            <div style={{ fontSize: 12, paddingLeft: 24, paddingRight: 24, whiteSpace: "pre-line", lineHeight:'120%' }}>
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