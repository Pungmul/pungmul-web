export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function MyPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 