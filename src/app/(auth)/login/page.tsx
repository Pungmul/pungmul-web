'use client'
import { useRouter } from "next/navigation";
import sendLoginRequest from "./utils";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    const [PWVisible, setPWVisible] = useState(false);
    const [isFailed, setFail] = useState(false);

    const loginHandler = async (userForm: { loginId: string, password: string }) => {
        try {
            const loginResponse = await sendLoginRequest(userForm);

            if (!loginResponse) throw Error('로그인 실패');

            router.replace(`/home`);

        } catch (e) {
            console.log(e);
            setFail(true);
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center">
            <div className="rounded-md flex flex-col gap-6" style={{ padding: '0 24px' }}>
                <div className="w-36 self-center h-20 bg-[#816DFF]" />
                <form action="" className="flex w-full flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget);
                        const loginId = formData.get('loginId') as string;
                        const password = formData.get('password') as string;
                        loginHandler({ loginId, password });
                    }}>
                    <div className="w-full">
                        <div className="flex flex-col" style={{ gap: 4, padding: '0 12px' }}>
                            <div className="text-[#816DFF]" style={{ fontSize: 14, marginLeft: 4, lineHeight: '15px' }}>ID</div>
                            <div className="flex flex-row items-center border border-[#CDC5FF]" style={{ gap: 8, padding: '8px 8px', borderRadius: 5 }}>
                                <input type="email" name="loginId" id="loginId" className="flex-grow outline-none placeholder-[#CDC5FF] text-[#816DFF]" placeholder="패명을 입력해주세요." style={{ padding: '' }} />
                            </div>
                            <div className="flex flex-row items-center" style={{ gap: 4 }}>
                                {/* <Image src={WarningCircleIcon} width={12} alt="" /> */}
                                <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>이미 사용중인 이메일 입니다.</div>
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
                                <div style={{ color: '#FF0000', fontSize: 12, lineHeight: '13px' }}>비밀번호가 일치하지 않습니다.</div>
                            </div>
                        </div>
                    </div>
                    <div className="fexl-col w-full" style={{ padding: '0 12px' }}>
                        {isFailed &&
                            <div className="w-56 text-red-400">로그인 실패: 계정을 확인해주세요.</div>}
                        <button type="submit" className="w-full border-[#816DFF] bg-[#816DFF] text-white py-2 rounded-md mt-2">로그인</button>
                    </div>
                </form>

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
                <div style={{ padding: '0 12px' }}>
                    <div className="w-full border border-[#816DFF] text-[#816DFF] text-center bg-white py-2 rounded-md mt-2 cursor-pointer" onClick={() => { router.push('/sign-up') }}>회원가입</div>
                </div>
            </div>
        </div>
    )
}