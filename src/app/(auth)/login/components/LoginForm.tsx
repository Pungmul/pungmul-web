'use client';

import { useState } from "react";

interface LoginFormProps {
    onLogin: (userForm: { loginId: string, password: string }) => void;
    loginFailed: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loginFailed }) => {

    const [PWVisible, setPWVisible] = useState(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const loginId = formData.get('loginId') as string;
        const password = formData.get('password') as string;
        onLogin({ loginId, password });
    }

    return (
        <form action="" className="flex w-full flex-col gap-4"
            onSubmit={onSubmit}>
            <div className="w-full">
                <div className="flex flex-col" style={{ gap: 4, padding: '0 12px' }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>ID</div>
                    <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type="email" name="loginId" id="loginId" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="패명을 입력해주세요." style={{ padding: '' }} />
                    </div>
                    <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        {/* <Image src={WarningCircleIcon} width={12} alt="" /> */}

                    </div>
                </div>
            </div>
            {/* <div className=" flex flex-row items-center border-purple-400 border-2 rounded-md px-2 p-1 bg-white ">
                        <span className="w-4 h-4 bg-purple-700" />
                        <input required type="email" name="loginId" id="loginId" placeholder="ID" className="flex-grow bg-transparent placeholder-gray-400 text-purple-800  py-0.5 px-2 outline-none" autoSave="off" autoComplete="off" />
                    </div> */}
            <div className="w-full">
                <div className="flex flex-col" style={{ gap: 4, padding: '0 12px' }}>
                    <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>비밀번호</div>
                    <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                        <input type={PWVisible ? 'text' : 'password'}
                            required
                            autoComplete="off"
                            name="password" id="password" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="비밀번호를 입력해주세요." style={{ padding: '' }} />
                        <span className={`w-4 h-4 ${PWVisible ? "bg-slate-200" : "bg-black"} cursor-pointer`} onClick={() => { setPWVisible(!PWVisible) }} />
                    </div>
                    <div className="flex flex-row items-center" style={{ gap: 4 }}>
                        {/* <Image src={WarningCircleIcon} width={12} alt="" /> */}

                    </div>
                </div>
            </div>
            <div className="fexl-col w-full" style={{ padding: '0 12px' }}>
                {loginFailed &&
                    <div className="w-56 text-red-400">로그인 실패: 계정을 확인해주세요.</div>}
                <button type="submit" className="w-full border-[#816DFF] bg-[#816DFF] text-white py-2 rounded-md mt-2">로그인</button>
            </div>
        </form>
    )
}

export default LoginForm;