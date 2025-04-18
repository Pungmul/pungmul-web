import type { Metadata } from "next";
import FCMClient from "./fcmComponent";
import { AnimatePresence } from "framer-motion";
import BottomTabs from "./BottomTabs";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <div id="main-contents" className="relative flex flex-col-reverse w-full h-full">

      <FCMClient />
      
      <BottomTabs />

      <div className="relative overflow-y-auto flex-grow">

          {children}
      </div>
      
    </div>
  );
}
