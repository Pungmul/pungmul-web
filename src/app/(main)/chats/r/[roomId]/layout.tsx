import { cookies } from "next/headers";
import { TokenProvider } from "@/features/auth";
import Suspense from "@pThunder/shared/components/SuspenseComponent";
import { ErrorBoundary } from "react-error-boundary";
import { ChatLoadFailFallback } from "@pThunder/features/chat/components/widget/ChatLoadFailFallback";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("accessToken")?.value;

  return (
    <ErrorBoundary
      FallbackComponent={ChatLoadFailFallback}
    >
      <Suspense>
        <TokenProvider token={token}>{children}</TokenProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
