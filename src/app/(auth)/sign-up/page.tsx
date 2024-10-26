'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import sendSignUpRequest from "./utils";

import "@pThunder/app/globals.css";

export default function SignUpPage() {

    const router = useRouter();
    const [PWValid, setPWValid] = useState(true);
    const [password, setPassword] = useState<string>(``)
    const [phoneNumber, setPhoneNumber] = useState('');
    const [PWVisible, setPWVisible] = useState(false);
    // const file = null;
    const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhoneNumber = formatPhoneNumber(e.currentTarget.value);
        setPhoneNumber(formattedPhoneNumber);
    };

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return cleaned;
    };

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!PWValid) return;
        const formData = new FormData(e.currentTarget);
        const userInfo = {
            loginId: formData.get('loginId') as string,
            name: formData.get('name') as string,
            password,
            clubName: formData.get('clubName') as string || null,
            birth: formData.get('birth') as string,
            clubAge: Number(formData.get('clubAge') as string) || null,
            gender: formData.get('gender') as string,
            phoneNumber: phoneNumber.replace(/\D/g, ''),
            email: formData.get('email') as string,
            area: formData.get('area') as string || null,
            clubId: Number(formData.get('clubId') as string) || null
        };

        const userForm = new FormData();


        const profileFile = formData.get('profile');

        
        if (profileFile) {
            userForm.append('profile', profileFile);
        }


        const accountBlob = new Blob([JSON.stringify(userInfo)], {
            type: 'application/json'
        });

        userForm.append('accountData', accountBlob);

        console.log(userForm)

        try {
            // 비동기로 요청을 전송
            const signupResult = await sendSignUpRequest(userForm);
            

            if(!signupResult) throw Error('회원가입 실패')

            router.replace(`/login`);
        } catch (e) {
            console.error('Signup failed:', e);
        }
    }

    return (
        <div className="w-full justify-center h-screen flex flex-col items-center justifyd-center">

            <div className="px-12 w-96 py-4 rounded-md border">
                <div className="flex flex-row justify-between items-start">

                    <div className="text-xl text-purple-800">회원 가입</div>

                    <div className="text-md cursor-pointer text-gray-400"
                        onClick={() => { router.back() }}
                    >X</div>
                </div>
                <form onSubmit={submitHandler} className="w-full flex flex-col gap-2 py-4">
                    <div className=" flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input required type="email" name="loginId" id="loginId" placeholder="ID" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none" autoSave="off" autoComplete="off" />
                    </div>
                    <div className={`flex flex-row items-center border-2 rounded-md px-2 p-1 bg-purple-200 ${PWValid ? `border-purple-400 bg-purple-200` : `border-red-600 bg-red-200`} `}>
                        <span className="w-4 h-4 bg-purple-700" />
                        <input type={PWVisible ? 'text' : 'password'}
                            required
                            autoComplete="off"
                            value={password}
                            placeholder="비밀번호"
                            onChange={e => setPassword(e.currentTarget.value)}
                            onBlur={(e) => {
                                const value = e.currentTarget.value;
                                const regex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,12}$/;
                                setPWValid(regex.test(value));
                            }} name="password" id="password" className={`flex-grow bg-transparent ${PWValid ? `placeholder-purple-400 text-purple-800` : password.length > 0 ? `placeholder-red-400 text-red-600` : `placeholder-red-400 text-red-600 underline`}   py-0.5 px-2 outline-none`} />
                        <span className={`w-4 h-4 ${PWVisible ? "bg-slate-200" : "bg-black"} cursor-pointer`} onClick={() => { setPWVisible(!PWVisible) }} />
                    </div>
                    {!PWValid && <div className=" flex flex-row items-center ">
                        <span className="flex-grow text-xs text-red-400">비밀번호는 영문, 숫자를 포함한 8~12자 이내의 문자입니다.</span>
                    </div>}
                    <div className="flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input required type="text" name="name" id="name" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none"
                            placeholder="이름" />
                    </div>
                    <div className="flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input type="text" name="clubName" id="clubName" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none"
                            placeholder="패 이름" />
                    </div>
                    <div className="flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input required type="date" max={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate()}`} name="birth" id="birth"
                            className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-1 outline-none" />
                    </div>
                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-row flex-grow items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200">
                            <span className="w-4 h-4 bg-purple-700" />
                            <select name="clubAge" id="clubAge" className="text-right flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none">
                                <option value="" disabled selected>학번</option>
                                {Array.from({ length: 100 }, (_, i) => i).map((number) => <option key={number + 'age'} value={`${number.toString().padStart(2, '0')}`}>{number.toString().padStart(2, '0')}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-row flex-grow items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200">
                            <span className="w-4 h-4 bg-purple-700" />
                            <select required name="gender" id="gender" defaultValue={"M"} className="text-right flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none">
                                <option value="M">남</option>
                                <option value="F">여</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input
                            placeholder="휴대전화번호"
                            value={phoneNumber}
                            onChange={handleTelChange}
                            required type="tel" name="phoneNumber" id="phoneNumber" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none" />
                    </div>
                    <div className="flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input placeholder="이메일(정보 수신)" required type="email" name="email" id="email" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none" />
                    </div>
                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-row flex-grow items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                            <span className="w-4 h-4 bg-purple-700" />
                            <select name="area" id="area" className="text-right flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none">
                                <option value="" disabled selected>지역 정보</option>
                                {/* <!-- 광역시 --> */}
                                <option value="seoul">서울</option>
                                <option value="busan">부산</option>
                                <option value="incheon">인천</option>
                                <option value="daegu">대구</option>
                                <option value="daejeon">대전</option>
                                <option value="gwangju">광주</option>
                                <option value="ulsan">울산</option>
                                <option value="sejong">세종</option>
                                {/* <!-- 도 --> */}
                                <option value="gyeonggi">경기</option>
                                <option value="gangwon">강원</option>
                                <option value="chungbuk">충북</option>
                                <option value="chungnam">충남</option>
                                <option value="jeonbuk">전북</option>
                                <option value="jeonnam">전남</option>
                                <option value="gyeongbuk">경북</option>
                                <option value="gyeongnam">경남</option>
                                <option value="jeju">제주</option>
                            </select>
                        </div>

                        <div className="flex flex-row flex-grow items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                            <span className="w-4 h-4 bg-purple-700" />
                            <select name="clubId" id="clubId" className="text-right flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-1 outline-none">
                                <option value="" disabled selected>소속패 ID</option>
                                {Array.from({ length: 30 }, (_, i) => i).map((number) => <option key={number + 'club'} value={`${number.toString().padStart(2, '0')}`}>{number.toString().padStart(2, '0')}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <label htmlFor="profile" className=" rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" >프로필 사진 선택</label>
                        <input type="file" name="profile" accept=".jpeg .png" id="profile" className="hidden" />
                    </div>
                    <button type="submit" className="w-full my-1 flex-grow rounded-md bg-purple-800 text-white py-0.5 px-1 outline-purple-700">제출</button>
                </form>
            </div>
        </div>
    )
}