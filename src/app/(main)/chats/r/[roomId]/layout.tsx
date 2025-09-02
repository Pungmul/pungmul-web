import { cookies } from "next/headers";
import { TokenProvider } from "@/features/auth";
import Suspense from "@pThunder/shared/components/SuspenseComponent";


export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const token = (await cookies()).get("accessToken")?.value;

  return (

      <Suspense>
        <TokenProvider token={token}>{children}</TokenProvider>
      </Suspense>

  );
}
