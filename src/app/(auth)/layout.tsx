import ReactQueryProviders from "@/shared/lib/useReactQuery";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProviders>
      {children}
    </ReactQueryProviders>
  );
}
