"use client"
import "@pThunder/app/globals.css";
import { Header } from "@pThunder/app/component/header";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inputStyle = {
    '::placeholder': {
        color: "#CDC5FF", // 원하는 색상
    },
    fontSize: 16,
};
export default function LightningCreatePage() {

    const router = useRouter()

    const [title, setTitle] = useState('')
    const [minPersonnel, setMinPersonnel] = useState(4)
    const [maxPersonnel, setMaxPersonnel] = useState(5)
    const [lightningType, setLightningType] = useState<string | null>(null)
    const [startTime, setStartTime] = useState(5)

    return (
        <div className="flex flex-col h-full w-full">
            <Header title="번개 만들기" />
            <div style={{ paddingTop: 24, gap: 28 }}
                className="flex flex-col flex-grow">
                <div
                    style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}
                    className="w-full flex flex-col"
                >
                    <div style={{ marginLeft: 4, fontSize: 14, color: '#9A9A9A' }}>번개 이름</div>
                    <input type="text" name="lightningName" id="lightningName"
                        value={title}
                        onChange={e => setTitle(e.currentTarget.value)}
                        style={{ ...inputStyle, borderColor: '#CDC5FF', fontSize: 14, outlineColor: '#816DFF' }}
                        className="px-2 py-3 w-full border rounded"
                        placeholder="번개의 이름을 입력해주세요." />
                </div>
                <div
                    style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}
                    className="w-full flex flex-col"
                >
                    <div style={{ marginLeft: 4, fontSize: 14, color: '#9A9A9A' }}>타입</div>
                    <div className="flex flex-row flex-wrap w-full gap-3">
                        {['춤추는 타입', '노래하는 타입', '물타입', '풀타입'].map((type) =>
                        (
                            <div
                                className="font-semibold px-3 py-1 flex items-center justify-center rounded-full border cursor-pointer"
                                style={{  borderColor: lightningType == type ? '#816DFF' : '#CDC5FF', backgroundColor: lightningType == type ? '#816DFF' : '#FFF', color: lightningType == type ? '#FFF' : '#CDC5FF', fontSize: 14 }}
                                onClick={() => { lightningType == type ? setLightningType(null) : setLightningType(type) }}>
                                {type}
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    style={{ paddingLeft: 24, paddingRight: 24, gap: 6 }}
                    className="w-full flex flex-col"
                >
                    <div className="w-full flex flex-col" style={{ gap: 20 }}>
                        <div className="flex flex-row justify-between" style={{ paddingLeft: 4, paddingRight: 4 }}>
                            <div style={{ fontSize: 14, color: '#9A9A9A' }}>최소 인원</div>
                            <div className="flex flex-row items-center justify-center" style={{ gap: 8 }}>
                                <div className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
                                    onClick={() => setMinPersonnel(prev => prev--)}>-</div>
                                <div style={{ width: 32, textAlign: 'center' }}>{minPersonnel}</div>
                                <div className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
                                    onClick={() => setMinPersonnel(prev => prev++)}>+</div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center" style={{ paddingLeft: 4, paddingRight: 4 }}>
                            <div style={{ fontSize: 14, color: '#9A9A9A' }}>최대 인원</div>
                            <div className="flex flex-row items-center justify-center" style={{ gap: 8 }}>
                                <div className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
                                    onClick={() => setMaxPersonnel(prev => prev--)}>-</div>
                                <div style={{ width: 32, textAlign: 'center' }}>{maxPersonnel}</div>
                                <div className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
                                    onClick={() => setMaxPersonnel(8)}>+</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div style={{ paddingLeft: 24, paddingRight: 24, gap: 4 }}
                    className="flex flex-col">
                    <div className="w-full relative" style={{ height: 24 }}>
                        <div className="relative h-full"
                            style={{ marginLeft: 12, marginRight: 12, }}>
                            <div style={{ paddingLeft: 24, paddingRight: 24, top: 10, backgroundColor: '#CBCBCB' }} className="absolute w-full h-1 "></div>
                            <div style={{ top: 10, left: (minPersonnel - 4) * 22, width: 22 * (maxPersonnel - minPersonnel), backgroundColor: '#816DFF' }} className="absolute w-full h-1 "></div>
                        </div>
                        <div className="absolute rounded-full border"
                            style={{ left: (minPersonnel - 4) * 22, top: 0, borderColor: '#CBCBCB', backgroundColor: '#FFF', width: 22, height: 22 }}>
                        </div>
                        <div className="absolute rounded-full border"
                            style={{ left: (maxPersonnel - 4) * 22, top: 0, borderColor: '#CBCBCB', backgroundColor: '#FFF', width: 22, height: 22 }}
                            onDrag={(e) => { e }}>
                        </div>
                    </div>
                    <div
                        className="flex flex-row w-full justify-between">
                        {Array.from({ length: 17 }).map((_, index) => {
                            return (index + 4 == minPersonnel || index + 4 == maxPersonnel) ?
                                <div style={{ width: 24, color: '#9A9A9A', fontSize: 10 }} className="flex items-center justify-center">{index + 4}</div>
                                :
                                <div style={{ width: 24, color: '#9A9A9A', fontSize: 6 }} className="flex items-center justify-center">|</div>
                        }

                        )}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center" style={{ paddingLeft: 28, paddingRight: 28 }}>
                    <div style={{ fontSize: 14, color: '#9A9A9A' }}>시작 시간</div>
                    <div className="flex flex-row items-center justify-center" style={{ gap: 8 }}>
                        <div className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
                        >-</div>
                        <div style={{ width: 64 }} className="text-center">5 분 후</div>
                        <div className="rounded-full border-gray-300 text-gray-500 cursor-pointer border w-6 h-6 items-center justify-center flex"
                        >+</div>
                    </div>
                </div>
            </div>
            <div className="w-full py-4"
                style={{ paddingLeft: 24, paddingRight: 24 }}>
                <div className="w-full flex items-center justify-center text-white rounded"
                    style={{ height: 48, backgroundColor: lightningType && title.length > 0 ? '#816DFF' : '#CDC5FF', cursor: lightningType && title.length > 0 ?'pointer':'auto' }}
                    onClick={()=>{
                        if(lightningType && title.length > 0)
                            router.push('create/check')
                    }}>생성하기</div>
            </div>
        </div>
    )
}