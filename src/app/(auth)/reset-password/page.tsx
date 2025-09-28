import { notFound } from "next/navigation";

import { ResetPasswordForm } from "@/features/auth";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token) {
    return notFound();
  }
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-[640px] mx-auto px-[24px]">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
