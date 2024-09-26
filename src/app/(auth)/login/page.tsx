'use client'
import { useRouter } from "next/navigation";
import sendLoginRequest from "./utils";

export default function LoginPage() {
    const router = useRouter();

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
            <div className="border px-6 py-6 rounded-md flex flex-col">
                <div className="w-36 self-center h-20 bg-purple-400 mb-6" />
                <form action="" className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget);
                        const loginId = formData.get('loginId') as string;
                        const password = formData.get('password') as string;
                        loginHandler({ loginId, password });
                    }}>
                    <div className=" flex flex-col items-start gap-1 w-64">
                        <span className="mr-2 w-16 text-purple-600">ID</span>
                        <input required type="email" name="loginId" id="loginId" className="w-full rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    <div className=" flex flex-col items-start gap-1 ">
                        <span className="mr-2 w-16 text-purple-600">비밀번호</span>
                        <input type="password"
                            required
                            name="password" id="password" className=" w-full rounded-md border border-violet-300 bg-purple-100 text-purple-800 py-0.5 px-1 outline-purple-700" />
                    </div>
                    <button type="submit" className="w-full bg-purple-800 text-white py-2 rounded-md mt-4">제출</button>
                </form>
            </div>
        </div>
    )
}