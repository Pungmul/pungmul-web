import { LightningCreateContextProvider } from "./LightiningContext";

export default function LightningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LightningCreateContextProvider>{children}</LightningCreateContextProvider>;
}
