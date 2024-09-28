'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import sendSignUpRequest from "./utils";


export default function SignUpPage() {

    const router = useRouter();
    const [PWValid, setPWValid] = useState(true);
    const [PWCValid, setPWCValid] = useState(true);
    const [password, setPassword] = useState<string>(``)
    const [confirmPassword, setConfirmPassword] = useState<string>(``)
    const [phoneNumber, setPhoneNumber] = useState('');
    const file = null;
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
        if (!PWCValid || !PWValid) return;
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

        console.log(profileFile)
        if (profileFile)
            userForm.append('profile', profileFile);


        const accountBlob = new Blob([JSON.stringify(userInfo)], {
            type: 'application/json'
        });
        userForm.append('accountData', accountBlob);
        console.log(userInfo)

        try {
            // 비동기로 요청을 전송
            await sendSignUpRequest(userForm);
            console.log('완료');
        } catch (e) {
            console.error('Signup failed:', e);
        }
    }

    return (
        <div className="w-full h-screen flex flex-col items-center justifyd-center">
            회원 가입
            <div className="px-12 border">
                <form onSubmit={submitHandler} className="w-full flex flex-col gap-2 py-4">
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">ID</span>
                        <input required type="email" name="loginId" id="loginId" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                        <div>중복 검사</div>
                    </div>
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">비밀번호</span>
                        <input type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.currentTarget.value)}
                            onBlur={(e) => {
                                const value = e.currentTarget.value;
                                const regex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
                                setPWValid(regex.test(value));
                            }} name="password" id="password" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    {!PWValid && <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32"></span>
                        <span className="flex-grow max-w-56 text-sm text-red-400">비밀번호는 영문, 숫자를 포함한 8~12자 이내의 문자입니다.</span>
                    </div>}
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">비밀번호 확인</span>
                        <input type="password"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.currentTarget.value)}
                            onBlur={(e) => {
                                const value = e.currentTarget.value;
                                setPWCValid(value == password);
                            }}
                            name="confirm-password" id="confirm-password" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    {!PWCValid && <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32"></span>
                        <span className="flex-grow max-w-56 text-sm text-red-400">비밀번호와 일치하지 않습니다.</span>
                    </div>}
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">이름</span>
                        <input required type="text" name="name" id="name" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">패 이름</span>
                        <input type="text" name="clubName" id="clubName" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">생일</span>
                        <input required type="date" max={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate()}`} name="birth" id="birth" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">학번</span>
                        <select name="clubAge" id="clubAge" className="text-right flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700">
                            {Array.from({ length: 100 }, (_, i) => i).map((number) => <option key={number + 'age'} value={`${number.toString().padStart(2, '0')}`}>{number.toString().padStart(2, '0')}</option>)}
                        </select>
                    </div>
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">성별</span>
                        <select required name="gender" id="gender" defaultValue={"M"} className="text-right flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700">
                            <option value="M">남</option>
                            <option value="F">여</option>
                        </select>
                    </div>
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">전화번호</span>
                        <input
                            value={phoneNumber}
                            onChange={handleTelChange}
                            required type="tel" name="phoneNumber" id="phoneNumber" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">이메일</span>
                        <input required type="email" name="email" id="email" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    <div className=" flex flex-row items-center"  >
                        <span className="mr-2 w-32">지역</span>
                        <input type="text" name="area" id="area" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">소속패 ID</span>
                        <input type="text" name="clubId" id="clubId" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    <div className=" flex flex-row items-center ">
                        <span className="mr-2 w-32">프로필 사진</span>
                        <input type="file" name="profile" accept=".jpeg .png" id="profile" className="flex-grow rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    <button type="submit" className="w-full my-1 flex-grow rounded-md bg-purple-800 text-white py-0.5 px-1 outline-purple-700">제출</button>
                </form>
            </div>
        </div>
    )
}