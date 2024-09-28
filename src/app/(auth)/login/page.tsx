'use client'
import { useRouter } from "next/navigation";
import sendLoginRequest from "./utils";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    const [PWVisible, setPWVisible] = useState(false);

    const loginHandler = async (userForm: { loginId: string, password: string }) => {
        const { loginId, password } = userForm;
        try {
            const loginResponse = await sendLoginRequest({ loginId, password });

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
                    <button type="submit" className="w-full bg-purple-800 text-white py-2 rounded-md mt-4">제출</button>
                </form>
                <div className="self-center text-gray-400 cursor-pointer" onClick={() => { router.push('/sign-up') }}>회원가입</div>
            </div>
        </div>
    )
}