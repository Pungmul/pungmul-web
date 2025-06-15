import { LightningCreateContextProvider } from "@pThunder/features/lightning/components/LightiningContext";

export default function LightningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LightningCreateContextProvider>{children}</LightningCreateContextProvider>
  );
}
