import { Header } from "@/shared/components/layout";

import { BuildProgressBar } from "@/features/lightning/components/widget/BulidProgressBar";
import { LightningBuildStoreProvider } from "@/features/lightning/contexts/LightningBuildStoreContext";

export default function LightningBuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LightningBuildStoreProvider>
      <div className="flex flex-1 flex-col">
        <Header title="" isBackBtn={true} />
        <BuildProgressBar />
        {children}
      </div>
    </LightningBuildStoreProvider>
  );
}
