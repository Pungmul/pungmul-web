'use client'
import { useRouter } from "next/navigation";
import sendLoginRequest from "./utils";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    const [PWVisible, setPWVisible] = useState(false);

    const loginHandler = async (userForm: { loginId: string, password: string }) => {
        try {
            const loginResponse = await sendLoginRequest(userForm);

            if (!loginResponse) throw Error('로그인 실패');

            router.replace(`/home`);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="border px-6 py-6 rounded-md flex flex-col gap-6">
                <div className="w-36 self-center h-20 bg-purple-400" />
                <form action="" className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget);
                        const loginId = formData.get('loginId') as string;
                        const password = formData.get('password') as string;
                        loginHandler({ loginId, password });
                    }}>
                    <div className=" flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-purple-200 ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input required type="email" name="loginId" id="loginId" placeholder="ID" className="flex-grow bg-transparent placeholder-purple-400 text-purple-800 py-0.5 px-2 outline-none" autoSave="off" autoComplete="off" />
                    </div>
                    <div className={`flex flex-row items-center border-2 rounded-md px-2 p-1 bg-purple-200  border-purple-400`}>
                        <span className="w-4 h-4 bg-purple-700" />
                        <input type={PWVisible ? 'text' : 'password'}
                            required
                            autoComplete="off"
                            placeholder="비밀번호"
                            name="password" id="password" className={`flex-grow bg-transparent placeholder-purple-400 text-purple-800  py-0.5 px-2 outline-none`} />
                        <span className={`w-4 h-4 ${PWVisible ? "bg-slate-200" : "bg-black"} cursor-pointer`} onClick={() => { setPWVisible(!PWVisible) }} />
                    </div>
                    <button type="submit" className="w-full bg-purple-800 text-white py-2 rounded-md mt-4">로그인</button>
                </form>
                <div className="self-center text-gray-400 cursor-pointer" onClick={() => { router.push('/sign-up') }}>회원가입</div>
                <div className="flex flex-row items-center">
                    <div className="flex-grow border-0.5" />
                    <div className="text-sm text-gray-300 mx-2">소셜 계정으로 로그인</div>
                    <div className="flex-grow border-0.5"></div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col w-14 items-center cursor-pointer" onClick={() => { }}>
                        <div className="w-12 h-12 rounded-full" >
                            <div className="w-12 h-12 naverBtn"></div>
                        </div>
                        <div className="text-gray-300 pt-2 font-medium text-sm">네이버</div>
                    </div>
                    <div className="flex flex-col w-14 items-center cursor-pointer" onClick={() => { }}>
                        <div className="w-12 h-12 rounded-full kakao-color overflow-hidden flex items-center justify-center">
                            <div className="w-7 h-7 kakaoBtn"></div>
                        </div>
                        <div className="text-gray-300 pt-2 font-medium text-sm">카카오</div>
                    </div>
                    <div className="flex flex-col w-14 items-center cursor-pointer" onClick={() => { }}>
                        <div className="w-12 h-12 rounded-full bg-slate-300" />
                        <div className="text-gray-300 pt-2 font-medium text-sm">Apple</div>
                    </div>
                    <div className="flex flex-col w-14 items-center cursor-pointer" onClick={() => { }}>
                        <div className="w-12 h-12 rounded-full border-0.5 border-slate-300" />
                        <div className="text-gray-300 pt-2 font-medium text-sm">Google</div>
                    </div>
                </div>
            </div>
        </div>
    )
}