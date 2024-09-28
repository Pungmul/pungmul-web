'use client'
import { useEffect, useState } from "react"
import { getInstrumentsInfomation, addInstrumentSkill } from "./utils";

interface InstrumentData { instrument: Instrument, instrumentAbility: string, major: boolean }
type Instrument = "KKWAENGGWARI" | "JING" | "JANGGU" | "BUK" | "SOGO" | "TAEPYUNGSO";
const instruments: Instrument[] = ["KKWAENGGWARI", "JING", "JANGGU", "BUK", "SOGO", "TAEPYUNGSO"];

export default function MyPagePage() {
    const [selectVisible, setVisible] = useState(false);
    const [isMain, setMain] = useState<Instrument | null>(null);
    const [instrumentData, setInstrumentsData] = useState([]);

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const addInst = formData.get('add_instrument') as string;
        if(addInst==null) return;
        try {
            const response = await addInstrumentSkill(addInst);
            if(!response) throw Error('악기 정보 업데이트 실패');
            console.log('업로드 완료')
        } catch (e){
            console.error(e);
        }
    }
    useEffect(() => {
        const loadInstrumentsData = async () => {
            const InstrumentsData = await getInstrumentsInfomation();
            console.log(InstrumentsData)
            setInstrumentsData(InstrumentsData)
        }
        loadInstrumentsData();
    }, [])
    useEffect(() => {
        instrumentData.map((instrumentData: InstrumentData) => {
            if (instrumentData.major)
                setMain(instrumentData.instrument)
        })
    }, [instrumentData])
    return (
        <div className="flex mt-20 flex-col items-center">
            <div className="w-96 my-2">
                <p className="ml-2 text-2xl font-bold">마이페이지</p>
            </div>
            <div className="border-gray-300 border rounded-md px-6 py-4 w-96 flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <span className="text-xl">이름</span><span className="text-xl">입니다</span>
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
                                <select name="add_instrument" id="add_instrument">
                                    {instruments.map(instrument => {
                                        return (
                                            <option value={instrument}>
                                                {instrument}
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
                        {instrumentData.map((instrumentData: InstrumentData) =>
                            <div className="flex flex-row justify-between group">
                                <div className="flex items-center flex-row gap-1">
                                    <div className={`w-4 h-4 border cursor-pointer ${instrumentData.major?'opacity-100':'opacity-0'} group-hover:opacity-100`}
                                        onClick={(e) => {
                                            e.currentTarget.classList.toggle('bg-amber-300')
                                        }} />
                                    <div>{instrumentData.instrument}</div>
                                </div>
                                <div className="flex items-center flex-row gap-1">
                                    <div>{instrumentData.instrumentAbility}</div>
                                    <div className="w-4 h-4 bg-red-500 cursor-pointer  opacity-0 group-hover:opacity-100" />
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>

        </div>
    )
}

