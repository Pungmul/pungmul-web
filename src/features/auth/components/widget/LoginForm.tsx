"use client";

import { useLoginForm } from "../../hooks/useLoginForm";
import { Input, Spinner } from "@/shared/components";

function LoginForm() {
  const { register, inputErrors, onSubmit, isPending, requestError } =
    useLoginForm();

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
      <Input
        label="ID"
        name="loginId"
        register={register}
        errorMessage={inputErrors.loginId?.message || ""}
      />
      <Input
        label="비밀번호"
        name="password"
        register={register}
        errorMessage={inputErrors.password?.message || ""}
        isEncrypted={true}
      />
      <div className="fexl-col w-full" style={{ padding: "0 12px" }}>
        {requestError && (
          <div className="w-56 text-red-400">
            로그인 실패: {requestError.message}
          </div>
        )}
      </div>
      <div className="w-full px-[8px]">
        <button
          disabled={isPending}
          type="submit"
          className={
            "w-full border-[#816DFF] bg-[#816DFF] text-white py-2 rounded-md flex justify-center items-center " +
            (isPending ? " bg-[#CDC5FF]" : " cursor-pointer")
          }
        >
          {isPending ? <Spinner /> : "로그인"}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
