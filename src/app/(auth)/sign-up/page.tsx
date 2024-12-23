'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import sendSignUpRequest from "./utils";

import Image from "next/image";
import checkMark from '@public/checkMark.svg';
import ChevronRightIcon from '@public/Chevron-right-icon.svg'

import WarningCircleIcon from '@public/Warning-circle-icon.svg'

import "@pThunder/app/globals.css";
import { Header } from "@pThunder/app/component/header";

export default function SignUpPage() {

    const router = useRouter();
    const [onStep, setStep] = useState(0)
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


            if (!signupResult) throw Error('회원가입 실패')

            router.replace(`/login`);
        } catch (e) {
            console.error('Signup failed:', e);
        }
    }

    const stepRender = () => {
        switch (onStep) {
            case 0:
                return <약관동의 />
            case 1:
                return <계정정보입력 />
            case 2:
                return <개인정보입력 />
        }
    }

    return (
        <div className="h-full w-full flex flex-col justifyd-center">
            <Header title="회원가입" />
            <div className="flex flex-col flex-grow flex-shrink-0">
                <StepReveal step={onStep} />
                {
                    stepRender()
                }
                <div className="w-full py-4"
                    style={{ padding:'12px 36px'}}>
                    <div className="w-full flex items-center justify-center text-white rounded"
                        style={{ height: 48, backgroundColor: '#816DFF', cursor: 'pointer' }}
                        onClick={() => { setStep(prev => prev+1) }}>
                        {onStep != 2 ? `다음` : '회원 가입 하기'}
                    </div>
                </div>
            </div>
        </div>
    )
}

const StepReveal = ({ step }: { step: number }) => {

    return (
        <div className="flex flex-row items-center" style={{ margin: '28px auto', padding: '0 12px', paddingTop: 4 }}>
            <div className="flex flex-col items-center overflow-visible" style={{ gap: 8, width: 48 }}>
                <div className={`flex items-center justify-center ${step == 0 ? ' bg-[#816DFF]' : ' bg-[#D9D9D9]'}  rounded-full`} style={{ height: 36, width: 36 }}>
                    <div className="text-white">1</div>
                </div>
                <div style={{ fontSize: 14, textAlign: 'center', color: step == 0 ? '#816DFF' : '#D9D9D9', lineHeight: '110%', width: 100 }}>
                    약관동의
                </div>
            </div>
            <div className="border-dashed border border-[#D9D9D9]" style={{ width: 65, marginBottom: 28 }} />

            <div className="flex flex-col items-center overflow-visible" style={{ gap: 8, width: 48 }}>
                <div className={`flex items-center justify-center ${step == 1 ? ' bg-[#816DFF]' : ' bg-[#D9D9D9]'}  rounded-full`} style={{ height: 36, width: 36 }}>
                    <div className="text-white">2</div>
                </div>
                <div style={{ fontSize: 14, textAlign: 'center', color: step == 1 ? '#816DFF' : '#D9D9D9', lineHeight: '110%', width: 100 }}>
                    계정 정보 입력
                </div>
            </div>

            <div className="border-dashed border border-[#D9D9D9]" style={{ width: 65, marginBottom: 28 }} />

            <div className="flex flex-col items-center overflow-visible" style={{ gap: 8, width: 48 }}>
                <div className={`flex items-center justify-center ${step == 2 ? ' bg-[#816DFF]' : ' bg-[#D9D9D9]'}  rounded-full`} style={{ height: 36, width: 36 }}>
                    <div className="text-white">3</div>
                </div>
                <div style={{ fontSize: 14, textAlign: 'center', color: step == 2 ? '#816DFF' : '#D9D9D9', lineHeight: '110%', width: 100 }}>
                    프로필 입력
                </div>
            </div>
        </div>
    )
}

const 개인정보입력 = () => {

    const [onClubSelect, setClubSelectState] = useState(false)

    return (
        <div className="flex flex-col flex-grow overflow-y-auto" style={{ gap: 20 }}>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>이름</div>
                    <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="text" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="이름을 입력해주세요." style={{ padding: '' }} />
                    </div>
                    <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>이미 사용중인 이메일 입니다.</div>
                    </div>
                </div>
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>패명</div>
                    <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="text" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="패명을 입력해주세요." style={{ padding: '' }} />
                    </div>
                    <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>이미 사용중인 이메일 입니다.</div>
                    </div>
                </div>
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>동아리리</div>
                    <div className="flex flex-row items-center border justify-between border-[#CDC5FF] cursor-pointer" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}
                        onClick={() => { if (!onClubSelect) setClubSelectState(true); else setClubSelectState(false) }}>
                        <div className="flex-grow text-[#CDC5FF]" style={{ padding: '' }} >
                            동아리를 선택해주세요.
                        </div>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                    </div>
                    {/* <div className="flex flex-row items-center" style={{ gap: 4 }}>
                                <Image src={WarningCircleIcon} width={12} alt="" />
                                <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>이미 사용중인 이메일 입니다.</div>
                            </div> */}
                </div>
                {onClubSelect && <div className="w-full relative" style={{ marginTop: 6 }}>
                    <div className="absolute w-full bg-white border overflow-y-auto" style={{ height: 180, borderRadius: 5, scrollbarWidth: 'thin' }}>
                        <div className="flex flex-col w-full">
                            <div className="w-full flex-shrink-0 bg-[#F4F2FF] sticky top-0" style={{ padding: '6px 12px' }}>
                                <div className="bg-white flex flex-row items-center justify-between" style={{ padding: '4px 6px', gap: 4, borderRadius: 2.5 }}>
                                    <input type="text" placeholder="검색" className="flex-grow outline-none" />
                                    <Image src={WarningCircleIcon} width={12} alt="" />
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow" style={{ gap: 8, padding: '8px' }}>
                                {Array.from({ length: 8 }).map((_, index) =>
                                    <div key={index + 'club'} className="w-full text-[#CDC5FF] cursor-pointer" style={{ padding: '4px' }}
                                        onClick={() => setClubSelectState(false)}
                                    >동아리 이름 어쩌구구
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>전화번호</div>
                    <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="text" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="전화번호를 입력해주세요." style={{ padding: '' }} />
                    </div>
                    <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>이미 사용중인 이메일 입니다.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const 계정정보입력 = () => {
    return (
        <div className="flex flex-col flex-grow overflow-y-auto" style={{ gap: 20 }}>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>ID</div>
                    <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="email" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="ID를 입력해주세요." style={{ padding: '' }} />
                    </div>
                    <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>이미 사용중인 이메일 입니다.</div>
                    </div>
                </div>
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>비밀번호</div>
                    <label htmlFor="password" className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="password" id="password" name="password" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="비밀번호를 입력해주세요." style={{ padding: '' }} />
                    </label>
                    <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>비밀번호는 영문,숫자,특수문자를 포함한 8~20자 입니다.</div>
                    </div>
                </div>
            </div>
            <div className="w-full" style={{ padding: '0 36px' }}>
                <div className="flex flex-col" style={{ gap: 4 }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>비밀번호 확인</div>
                    <label
                        htmlFor="password-confirm" className="flex flex-row items-center border  border-[#CDC5FF] peer-focus-within:border-[#816DFF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="password" id="password-confirm" name="password-confirm" className="peer flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="비밀번호를 다시 입력해주세요." style={{ padding: '' }} />
                    </label>
                    <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        <Image src={WarningCircleIcon} width={12} alt="" />
                        <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>비밀번호와 일치하지 않습니다.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const 약관동의 = () => {
    return (
        <div className="flex flex-col flex-grow">
            <div style={{ padding: '0 24px', width: '100%' }}>
                <label
                    htmlFor="all_check"
                    className="flex w-full flex-row items-center cursor-pointer bg-[#E7E7E7]"
                    style={{ padding: '16px 12px', borderRadius: 5, gap: 8 }}
                >
                    <input
                        type="checkbox"
                        defaultChecked={false}
                        name="all_check"
                        id="all_check"
                        className="hidden peer"
                    />
                    <div
                        className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
                        style={{ backgroundColor: '#816DFF', width: 16, height: 16 }}
                    >
                        <Image src={checkMark} width={12} alt="" />
                    </div>
                    <div
                        className="block w-5 h-5 border border-[#979797] peer-checked:hidden rounded-sm"
                        style={{ backgroundColor: '#FFF', width: 16, height: 16 }}
                    />
                    <div style={{ fontSize: 14, lineHeight: '16px' }} className="text-[#818181] peer-checked:text-black peer-checked:font-semibold">
                        모든 약관에 동의
                    </div>
                </label>
            </div>
            <div
                className="flex flex-col"
                style={{ padding: '0 24px', width: '100%', gap: 28, marginTop: 28 }}>

                <div className="flex flex-row justify-between items-center"
                    style={{ padding: '0 12px', }}>
                    <label
                        htmlFor="약관"
                        className="flex w-full flex-row items-center cursor-pointer"
                        style={{ borderRadius: 5, gap: 8 }}
                    >
                        <input
                            type="checkbox"
                            defaultChecked={false}
                            name="약관"
                            id="약관"
                            className="hidden peer"
                        />
                        <div
                            className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
                            style={{ backgroundColor: '#816DFF', width: 16, height: 16 }}
                        >
                            <Image src={checkMark} width={12} alt="" />
                        </div>
                        <div
                            className="block w-5 h-5 border border-[#979797] peer-checked:hidden rounded-sm"
                            style={{ backgroundColor: '#FFF', width: 16, height: 16 }}
                        />
                        <div className="flex flex-row items-center text-[#818181] peer-checked:text-black peer-checked:font-semibold" style={{ gap: 4 }}>
                            <div style={{ fontSize: 14, lineHeight: '16px' }} className="">약관동의</div>
                            <div style={{ fontSize: 14, lineHeight: '16px', fontWeight: 500 }} className="text-[#FF0000]">(필수)</div>
                        </div>
                    </label>

                    <Image src={ChevronRightIcon} width={16} alt="" className="cursor-pointer" />
                </div>

                <div className="flex flex-row justify-between items-center"
                    style={{ padding: '0 12px', }}>
                    <label
                        htmlFor="개인정보"
                        className="flex w-full flex-row items-center cursor-pointer"
                        style={{ borderRadius: 5, gap: 8 }}
                    >
                        <input
                            type="checkbox"
                            defaultChecked={false}
                            name="개인정보"
                            id="개인정보"
                            className="hidden peer"
                        />
                        <div
                            className="hidden w-5 h-5 peer-checked:flex rounded-sm items-center justify-center"
                            style={{ backgroundColor: '#816DFF', width: 16, height: 16 }}
                        >
                            <Image src={checkMark} width={12} alt="" />
                        </div>
                        <div
                            className="block w-5 h-5 border border-[#979797] peer-checked:hidden rounded-sm"
                            style={{ backgroundColor: '#FFF', width: 16, height: 16 }}
                        />
                        <div className="flex flex-row items-center text-[#818181] peer-checked:text-black peer-checked:font-semibold" style={{ gap: 4 }}>
                            <div style={{ fontSize: 14, lineHeight: '16px' }} className="">개인정보 이용동의</div>
                            <div style={{ fontSize: 14, lineHeight: '16px', fontWeight: 500 }} className="text-[#FF0000]">(필수)</div>
                        </div>
                    </label>
                    <Image src={ChevronRightIcon} width={16} alt="" className="cursor-pointer" />
                </div>
            </div>
        </div>
    )
}



{/* <form onSubmit={submitHandler} className="w-full flex flex-col gap-2 py-4">
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
        <select name="clubId" id="clubId" className="text-right flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-1 outline-none">
            <option value="" disabled selected>소속패 ID</option>
            {Array.from({ length: 30 }, (_, i) => i).map((number) => <option key={number + 'club'} value={`${number.toString().padStart(2, '0')}`}>{number.toString().padStart(2, '0')}</option>)}
        </select>
    </div>
                    </div >
                    <div className="flex flex-row items-center justify-between border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <label htmlFor="profile" className=" rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" >프로필 사진 선택</label>
                        <input type="file" name="profile" accept=".jpeg .png" id="profile" className="hidden" />
                    </div>
                    <button type="submit" className="w-full my-1 flex-grow rounded-md bg-purple-800 text-white py-0.5 px-1 outline-purple-700">제출</button>
                </form > */}