'use client'
import { useEffect, useState } from "react"
import { getInstrumentsInfomation, addInstrumentSkill } from "./utils";
import { tree } from "next/dist/build/templates/app-page";

interface InstrumentData { instrument: Instrument, instrumentAbility: Level, major: boolean }
type Instrument = "KKWAENGGWARI" | "JING" | "JANGGU" | "BUK" | "SOGO" | "TAEPYUNGSO";
const instruments: Instrument[] = ["KKWAENGGWARI", "JING", "JANGGU", "BUK", "SOGO", "TAEPYUNGSO"];

const instrumentNamesMap: { [key in Instrument]: string } = {
    KKWAENGGWARI: "꽹과리",
    JING: "징",
    JANGGU: "장구",
    BUK: "북",
    SOGO: "소고",
    TAEPYUNGSO: "태평소"
};
type Level = "UNSKILLED" | "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

const levels: Level[] = ["UNSKILLED", "BASIC", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const levelNamesMap: { [key in Level]: string } = {
    UNSKILLED: "초심자",
    BASIC: "초급자",
    INTERMEDIATE: "중급자",
    ADVANCED: "숙련자",
    EXPERT: "전문가",
};
export default function MyPagePage() {
    const [selectVisible, setVisible] = useState(false);
    const [isMain, setMain] = useState<string | null>(null);
    const [instrumentsData, setInstrumentsData] = useState<InstrumentData[]>([]);
    const [userData, setUser] = useState<any>(null)

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const addInst = formData.get('add_instrument') as string;
        if (addInst == null) return;
        try {
            const response = await addInstrumentSkill(addInst);
            if (!response) throw Error('악기 정보 업데이트 실패');
            console.log('업로드 완료')
            setVisible(false)

            const InstrumentsData = await getInstrumentsInfomation();
            setInstrumentsData(InstrumentsData)

        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        const sortedInstrumentsData = [...instrumentsData].sort((a, b) => {
            if (isMain == (a.instrument) && isMain != (b.instrument)) return -1;  // `a`가 `ismain`에 포함되면 `a`를 상단으로
            if (isMain != (a.instrument) && isMain == (b.instrument)) return 1;   // `b`가 `ismain`에 포함되면 `b`를 상단으로
            if (levels.indexOf(b.instrumentAbility) == levels.indexOf(a.instrumentAbility))
                return instruments.indexOf(a.instrument) - instruments.indexOf(b.instrument)
            return levels.indexOf(b.instrumentAbility) - levels.indexOf(a.instrumentAbility)
        });
        setInstrumentsData(sortedInstrumentsData);
    }, [isMain])

    useEffect(() => {
        const loadInstrumentsData = async () => {
            const data = await getInstrumentsInfomation();
            const { instrumentStatusDTOList: InstrumentsData } = data;
            setUser(data);
            setInstrumentsData(InstrumentsData)
        }
        loadInstrumentsData();
    }, [])

    useEffect(() => {
        instrumentsData.map((instrumentData: InstrumentData) => {
            if (instrumentData.major)
                setMain(instrumentData.instrument)
        })
    }, [instrumentsData])

    return (
        <div className="flex mt-20 flex-col items-center">
            <div className="w-96 my-2">
                <p className="ml-2 text-2xl font-bold">마이페이지</p>
            </div>
            <div className="border-gray-300 border rounded-md px-6 py-4 w-96 flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <span className="text-gray-400">이름</span><span>{userData?.name}{`${userData?.clubName?` (${userData.clubName})`:''}`}</span>
                </div>
                <div className="flex flex-row justify-between">
                    <span className="text-gray-400">동아리</span><span>{userData?.name}{` (${userData?.clubAge})`} </span>
                </div>
                <div className="flex flex-row justify-between">
                    <span className="text-gray-400">성별</span><span>{userData?.gender=="M"?"남":"여"}</span>
                </div>
                <div className="flex flex-row justify-between">
                    <span className="text-gray-400">이름</span><span>{userData?.phoneNumber}</span>
                </div>
                <div className="relative">
                    <form
                        onSubmit={submitHandler}
                        className={`absolute ${selectVisible ? `flex` : `hidden`} right-0 z-10 top-6 bg-white flex-col rounded-md px-4 py-4 gap-4 shadow-md`}>
                        <div className="flex flex-row justify-between items-start  w-48">
                            <div className="text-xl font-semibold">추가할 악기</div>
                            <div className="text-md text-gray-200 cursor-pointer"
                                onClick={() => setVisible(false)}>X</div>
                        </div>
                        <div className="flex flex-row justify-between mx-1">
                            <div>악기</div>
                            <div>
                                <select name="add_instrument" id="add_instrument" className="text-right">
                                    {
                                        instruments.filter(instrument => !instrumentsData.map(data => data.instrument).includes(instrument)).map(instrument => {
                                            return (
                                                <option key={instrument} value={instrument}>
                                                    {instrumentNamesMap[instrument]}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                        </div>
                        <button className="px-3 py-1 rounded-md bg-blue-600 text-white self-end cursor-pointer">추가</button>
                    </form>
                    <div className="text-xl">악기 정보</div>
                    <div className="-right-0.5 top-0 p-0.5 absolute cursor-pointer text-gray-300"
                        onClick={() => setVisible(true)}>추가하기</div>
                    <div className="flex flex-col gap-2 px-0.5 py-2 rounded border border-gray-200 my-2">
                        {instrumentsData.map((instrumentData: InstrumentData, index: number) =>
                            <div key={instrumentData.instrument} className="flex flex-row justify-between group">
                                <div className="flex items-center flex-row gap-1">
                                    <div className={`w-4 h-4 border cursor-pointer group-hover:opacity-100 ${instrumentData.instrument == isMain ? 'bg-amber-300 border-amber-300 ' : `opacity-0`}`}
                                        onClick={() => {
                                            setMain(instrumentData.instrument)
                                        }} />
                                    <div>{instrumentNamesMap[instrumentData.instrument]}</div>
                                </div>
                                <div className="flex items-center flex-row gap-1">
                                    <div>{levelNamesMap[instrumentData.instrumentAbility]}</div>
                                    <div className="w-4 h-4 bg-red-500 cursor-pointer  opacity-0 group-hover:opacity-100"
                                        onClick={() => {
                                            const updatedData = [...instrumentsData];
                                            updatedData.splice(index, 1);  // 해당 index에서 1개 항목 제거
                                            setInstrumentsData(updatedData);
                                            instrumentData.major = true;
                                        }} />
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>

        </div>
    )
}

